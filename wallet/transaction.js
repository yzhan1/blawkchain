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
    Transaction.signTransaction(transaction, senderWallet);

    return transaction;
  }

  static signTransaction(transaction, senderWallet) {
    transaction.input = {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(ChainUtil.hash(transaction.outputs))
    };
  }

  static verifyTransaction(transaction) {
    return ChainUtil.verifySignature(
      transaction.input.address, 
      transaction.input.signature, 
      ChainUtil.hash(transaction.outputs)
    );
  }
}

module.exports = Transaction;