const SHA256 = require('crypto-js/sha256');

class Block {
  constructor(timestamp, prevHash, hash, data) {
    this.timestamp = timestamp;
    this.prevHash = prevHash;
    this.hash = hash;
    this.data = data;
  }

  static getGenesis() {
    return new this('Gen time', '-----', 'f1r57', []);
  }

  static getMineBlock(prevBlock, data) {
    const
      timestamp = Date.now(),
      prevHash = prevBlock.hash,
      hash = Block.hash(timestamp, prevHash, data);

    return new this(timestamp, prevHash, hash, data);
  }

  static hash(timestamp, prevHash, data) {
    return SHA256(`${timestamp}${prevHash}${data}`).toString();
  }

  static blockHash(block) {
    const { timestamp, prevHash, data } = block;
    return Block.hash(timestamp, prevHash, data);
  }

  toString() {
    return `Block -
      Timestamp: ${this.timestamp},
      PrevHash : ${this.prevHash.substring(0, 10)},
      Hash     : ${this.hash.substring(0, 10)},
      Data     : ${this.data}
    `;
  }
}

module.exports = Block;