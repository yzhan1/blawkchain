const Transaction = require('./transaction');
const Wallet = require('./index');

describe('Transaction', () => {
  let transaction, wallet, recipient, amount;

  beforeEach(() => {
    wallet = new Wallet();
    amount = 50;
    recipient = 'recipient';
    transaction = Transaction.getNewTransaction(wallet, recipient, amount);
  });

  it('should outputs `amount` subtracted from the wallet balance', () => {
    expect(transaction.outputs.find((output) => output.address === wallet.publicKey).amount)
      .toEqual(wallet.balance - amount);
  });

  it('should outputs `amount` added to the recipient', () => {
    expect(transaction.outputs.find((output) => output.address === recipient).amount)
      .toEqual(amount);
  });

  it('should input the balance of the wallet', () => {
    expect(transaction.input.amount).toEqual(wallet.balance);
  });

  it('should validate a valid transaction', () => {
    expect(Transaction.verifyTransaction(transaction)).toBe(true);
  });

  it('should invalidate a invalid transaction', () => {
    transaction.outputs[0].amount = 50000;
    expect(Transaction.verifyTransaction(transaction)).toBe(false);
  });

  describe('Transactions with amount exceeding the balance', () => {
    beforeEach(() => {
      amount = 5000;
      transaction = Transaction.getNewTransaction(wallet, recipient, amount);
    });

    it('should not create transaction', () => {
      expect(transaction).toEqual(undefined);
    });
  });

  describe('updating transactions', () => {
    let nextAmount, nextRecipient;

    beforeEach(() => {
      nextAmount = 20;
      nextRecipient = 'nextAddress';
      transaction = transaction.update(wallet, nextRecipient, nextAmount);
    });

    it('should subtract next amount from sender output', () => {
      expect(transaction.outputs.find((output) => output.address === wallet.publicKey).amount)
        .toEqual(wallet.balance - amount - nextAmount);
    });

    it('should output amount for next recipient', () => {
      expect(transaction.outputs.find((output) => output.address === nextRecipient).amount)
        .toEqual(nextAmount);
    });
  });
});