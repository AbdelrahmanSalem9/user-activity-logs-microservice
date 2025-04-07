require("dotenv").config();
const { Kafka } = require("kafkajs");
const { generateRandomLog } = require("../custom-utils/log-utils");


const writeRate = process.env.PRODUCER_LOG_RATE;
const kafkaHost = process.env.KAFKA_HOST || "kafka";

const kafka = new Kafka({
  clientId: "transaction-producer",
  brokers: [`${kafkaHost}:9092`],
});
const producer = kafka.producer();

async function produceLog() {
  try {
    await producer.connect();

    while (true) {
      const log = generateRandomLog();
      await producer.send({
        topic: "transaction-activity",
        messages: [{ value: JSON.stringify(log) }],
      });

      console.log("Log sent to Kafka:", log);
      await new Promise((resolve) => setTimeout(resolve, writeRate));
    }
  } catch (error) {
    console.error("Error producing log:", error);
  } finally {
    await producer.disconnect();
  }
}

produceLog().catch(console.error);
