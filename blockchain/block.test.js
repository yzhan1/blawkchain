const Block = require('./block');

describe('Block', () => {
  let data, prevBlock, block;

  beforeEach(() => {
    data = 'fake data',
    prevBlock = Block.getGenesis(),
    block = Block.getMineBlock(prevBlock, data);
  });

  it('should set `data` to match input', () => {
    expect(block.data).toEqual(data);
  });

  it('should set `prevHash` to match hash of prevBlock', () => {
    expect(block.prevHash).toEqual(prevBlock.hash);
  });

  it('should generate hash that matches the difficulty', () => {
    const difficulty = block.difficulty;
    expect(block.hash.substring(0, difficulty)).toEqual('0'.repeat(difficulty));
  });

  it('should lower the difficulty for slowly mined blocks', () => {
    expect(Block.adjustDifficulty(block, block.timestamp + 360000))
      .toEqual(block.difficulty - 1);
  });

  it('should increase the difficulty for quickly mined blocks', () => {
    expect(Block.adjustDifficulty(block, block.timestamp + 1))
      .toEqual(block.difficulty + 1);
  });
});