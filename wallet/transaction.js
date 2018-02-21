const ChainUtil = require('../utils');
const logger = require('tracer').console();

class Transaction {
  constructor() {
    this.id = ChainUtil.getId();
    this.input = null;
    this.outputs = [];
  }

  static getNewTransaction(senderWallet, recipient, amount) {
    const transaction = new this();

    if (amount > senderWallet.balance) {
      logger.error(`Amount: ${amount} exceeds balance.`);
      return;
    }

    transaction.outputs.push(...[
      { amount: senderWallet.balance - amount, address: senderWallet.publicKey },
      { amount, address: recipient }
    ]);
    return transaction;
  }
}

module.exports = Transaction;