import sha256 from "crypto-js/sha256.js";
class Block {
  constructor(index, timestamp, data, previousHash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return sha256(
      this.index +
        this.timestamp +
        this.previousHash +
        JSON.stringify(this.data) +
        this.nonce
    ).toString();
  }

  mineBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log("Block Mined", this.hash);
  }
}

class BlockChain {
  constructor() {
    this.chain = [this.createGenisisBlock()];
    this.difficulty = 4;
  }

  createGenisisBlock() {
    return new Block(0, "23/01/2004", "Genisis Block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const current = this.chain[i];
      const prev = this.chain[i - 1];
      if (
        current.hash !== current.calculateHash() ||
        current.previousHash !== prev.hash
      ) {
        return false;
      }
    }
    return true;
  }
}

let shivamCoin = new BlockChain();
console.log("Mining Block 1....")
shivamCoin.addBlock(new Block(1, "24/01/2004", { amount: 259 }));
console.log("Mining Block 2....")
shivamCoin.addBlock(new Block(2, "26/01/2004", { amount: 400 }));

