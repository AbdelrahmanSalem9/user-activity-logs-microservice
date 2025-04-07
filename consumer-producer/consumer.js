require("dotenv").config();
const { Kafka } = require("kafkajs");
const mongoose = require("mongoose");
const TransactionActivity = require("../models/TransactionActivity");
const { formatLog } = require("../custom-utils/log-utils");

const kafkaHost = process.env.KAFKA_HOST || "kafka";
const restartDelay = process.env.CONSUMER_RESTART_DELAY;
const mongodbUri = process.env.MONGODB_URL;

const kafka = new Kafka({
  clientId: "transaction-consumer",
  brokers: [`${kafkaHost}:9092`],
});

const consumer = kafka.consumer({ groupId: "transaction-group" });

// MongoDB connection creation
async function connectToMongodb() {
  try {
    await mongoose.connect(mongodbUri);
    console.log("Connected to Mongodb");
  } catch (error) {
    console.error("Error connecting to Mongodb:", error);
    process.exit(1);
  }
}

async function consumeLogs() {
  await connectToMongodb();

  try {
    await consumer.connect();
    await consumer.subscribe({
      topic: "transaction-activity",
      fromBeginning: true,
    });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const log = JSON.parse(message.value.toString());

        try {
          // Validate and save log using Mongoose
          const transaction = new TransactionActivity(log);
          await transaction.validate();
          await transaction.save();
          console.log(formatLog(topic, partition, message));
        } catch (error) {
          console.error("Invalid log, skipping:", log, error.message);
        }
      },
    });
  } catch (error) {
    console.error("Error consuming logs:", error);
    await consumer.disconnect();
    process.exit(1);
  }
}

// Ensure the consumer runs continuously
(async () => {
  try {
    await consumeLogs();
  } catch (error) {
    console.error("Consumer crashed, restarting...", error);
    // Restart the consumer after a short delay
    setTimeout(() => consumeLogs(), restartDelay);
  }
})();
