const TransactionPool = require('./transactionPool');
const Transaction = require('./transaction');
const Wallet = require('./index');

describe('TransactionPool', () => {
  let pool, transaction, wallet;

  beforeEach(() => {
    pool = new TransactionPool();
    wallet = new Wallet();
    transaction = Transaction.getNewTransaction(wallet, 'ksfbew8324', 30);
    pool.updateOrAddTransaction(transaction);
  });

  it('should add transaction to the pool', () => {
    expect(pool.transactions.find(t => t.id === transaction.id)).toEqual(transaction);
  });

  it('should update transaction', () => {
    const oldTransaction = JSON.stringify(transaction);
    const newTransaction = transaction.update(wallet, 'skbfeow324', 50);
    pool.updateOrAddTransaction(newTransaction);

    expect(JSON.stringify(pool.transactions.find(t => t.id === newTransaction.id)))
      .not.toEqual(oldTransaction);
  });
});