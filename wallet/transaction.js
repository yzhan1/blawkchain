const ChainUtil = require('../utils');
const logger = require('tracer').console();

class Transaction {
  constructor() {
    this.id = ChainUtil.getId();
    this.input = null;
    this.outputs = [];
  }

  update(senderWallet, recipient, amount) {
    const senderOutput = this.outputs.find((output) => output.address === senderWallet.publicKey);

    if (!Transaction.verifyAmount(amount, senderOutput.amount)) {
      return;
    }

    senderOutput.amount -= amount;
    this.outputs.push({ amount, address: recipient });
    Transaction.signTransaction(this, senderWallet);

    return this;
  }

  static getNewTransaction(senderWallet, recipient, amount) {
    if (!Transaction.verifyAmount(amount, senderWallet.balance)) {
      return;
    }

    const transaction = new this();
    transaction.outputs.push(...[
      { amount: senderWallet.balance - amount, address: senderWallet.publicKey },
      { amount, address: recipient }
    ]);
    Transaction.signTransaction(transaction, senderWallet);

    return transaction;
  }

  static verifyAmount(amount, balance) {
    if (amount > balance) {
      logger.error(`Amount: ${amount} exceeds balance.`);
      return false;
    }
    return true;
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