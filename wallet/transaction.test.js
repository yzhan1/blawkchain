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

  describe('Transactions with amount exceeding the balance', () => {
    beforeEach(() => {
      amount = 5000;
      transaction = Transaction.getNewTransaction(wallet, recipient, amount);
    });

    it('should not create transaction', () => {
      expect(transaction).toEqual(undefined);
    });
  });
});