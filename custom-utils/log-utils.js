require("dotenv").config();

function generateRandomLog() {
  const usersCount = process.env.NUMBER_OF_USERS || 100;
  const maxAmountVal = process.env.MAX_AMOUNT_VALUE || 10000;

  const actions = ["send", "receive", "balance_inquiry"];
  const action = actions[Math.floor(Math.random() * actions.length)];
  const log = {
    userId: `user-${Math.floor(Math.random() * usersCount)}`,
    action: action,
    amount:action === "balance_inquiry"? undefined: Math.floor(Math.random() * maxAmountVal),
    timestamp: new Date().toISOString(),
  };
  return log;
}

function formatLog(topic, partition, message) {
  return `${topic}[${partition} | ${message.offset}] - ${message.value}`;
}

module.exports = { generateRandomLog, formatLog };
