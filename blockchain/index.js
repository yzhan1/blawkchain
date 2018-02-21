const logger = require('tracer').console();
const Block = require('./block');

class Blockchain {
  constructor() {
    this.chain = [Block.getGenesis()];
  }
  
  addBlock(data) {
    const
      prevBlock = this.chain[this.chain.length - 1],
      block = Block.getMineBlock(prevBlock, data);
    this.chain.push(block);

    return block;
  }

  isValid(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.getGenesis())) {
      return false;
    }
    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const prevBlock = chain[i - 1];
      if (block.prevHash !== prevBlock.hash || block.hash !== Block.blockHash(block)) {
        return false;
      }
    }
    return true;
  }
  
  replace(chain) {
    if (chain.length <= this.chain.length) {
      logger.error('New chain shorted than current');
      return;
    } else if (!this.isValid(chain)) {
      logger.error('New chain is not valid');
      return;
    }

    logger.info('Replacing current chain with new chain');
    this.chain = chain;
  }
}

module.exports = Blockchain;