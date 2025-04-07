const mongoose = require('mongoose');

const transactionActivitySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  action: {
    type: String,
    enum: ['send', 'receive', 'balance_inquiry'],
    required: true,
  },
  
  // balance inquiry take null in the amount field
  // and for send/receive takes postive value only
  amount: { type: Number, required: false, validator: (value) => {
    return value === null || value > 0 
} }, 
  timestamp: { type: Date, required: true, index: true },
});

transactionActivitySchema.index({ userId: 1, action: 1, timestamp: -1 });

const TransactionActivity = mongoose.model('TransactionActivity',transactionActivitySchema);

module.exports = TransactionActivity;