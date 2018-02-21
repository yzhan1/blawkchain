const SHA256 = require('crypto-js/sha256');
const logger = require('tracer').console();
const { DIFFICULTY, MINE_RATE } = require('../config');

class Block {
  constructor(timestamp, prevHash, hash, data, nonce, difficulty) {
    this.timestamp = timestamp;
    this.prevHash = prevHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty || DIFFICULTY;
  }

  static getGenesis() {
    return new this('Gen time', '-----', 'f1r57-h45h', [], 0, DIFFICULTY);
  }

  static getMineBlock(prevBlock, data) {
    const prevHash = prevBlock.hash;

    // proof of work
    let { difficulty } = prevBlock;
    let nonce = 0, hash, timestamp;
    do {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty(prevBlock, timestamp);
      hash = Block.hash(timestamp, prevHash, data, nonce, difficulty);
    } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));
    
    return new this(timestamp, prevHash, hash, data, nonce, difficulty);
  }

  static hash(timestamp, prevHash, data, nonce, difficulty) {
    return SHA256(`${timestamp}${prevHash}${data}${nonce}${difficulty}`).toString();
  }

  static blockHash(block) {
    const { timestamp, prevHash, data, nonce, difficulty } = block;
    return Block.hash(timestamp, prevHash, data, nonce, difficulty);
  }

  static adjustDifficulty(prevBlock, currentTime) {
    let { difficulty } = prevBlock;
    difficulty = prevBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1;
    return difficulty;
  }

  toString() {
    return `Block -
      Timestamp  : ${this.timestamp},
      PrevHash   : ${this.prevHash.substring(0, 10)},
      Hash       : ${this.hash.substring(0, 10)},
      Nonce      : ${this.nonce},
      Difficulty : ${this.difficulty},
      Data       : ${this.data}
    `;
  }
}

module.exports = Block;