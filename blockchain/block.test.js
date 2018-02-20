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
});