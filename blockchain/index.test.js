const Blockchain = require('./index');
const Block = require('./block');

describe('Blockchain', () => {
  let blockchain, secondChain;

  beforeEach(() => {
    blockchain = new Blockchain();
    secondChain = new Blockchain();
  });

  it('should start with genesis block', () => {
    expect(blockchain.chain[0]).toEqual(Block.getGenesis());
  });

  it('should add new block', () => {
    const data = 'test data';
    blockchain.addBlock(data);

    expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(data);
  });

  it('should validate a valid chain', () => {
    secondChain.addBlock('test data');

    expect(blockchain.isValid(secondChain.chain)).toBe(true);
  });

  it('should invalidate a chain with corrupt genesis block', () => {
    secondChain.chain[0].data = 'bad data';

    expect(blockchain.isValid(secondChain.chain)).toBe(false);
  });

  it('should invalidate a corrupt chain', () => {
    secondChain.addBlock('test');
    secondChain.chain[1].data = 'bad data';
    
    expect(blockchain.isValid(secondChain.chain)).toBe(false);
  });

  it('should replace chain with valid chain', () => {
    secondChain.addBlock('test');
    blockchain.replace(secondChain.chain);

    expect(blockchain.chain).toEqual(secondChain.chain);
  });

  it('should not replace chain with valid chain if new chain is shorter or same', () => {
    blockchain.addBlock('test');
    blockchain.replace(secondChain.chain);

    expect(blockchain.chain).not.toEqual(secondChain.chain);
  });
});