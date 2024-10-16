import sha256 from "crypto-js/sha256.js";

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}
class Block {
  constructor(timestamp, transaction, previousHash = "") {
    this.timestamp = timestamp;
    this.transaction = transaction;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return sha256(
      this.timestamp +
        this.previousHash +
        JSON.stringify(this.transaction) +
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
    this.difficulty = 2;
    this.pendingTransaction = [];
    this.miningReward = 100;
  }

  createGenisisBlock() {
    return new Block("23/01/2004", "Genisis Block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransaction(miningRewardAddress) {
    let block = new Block(new Date(), this.pendingTransaction);
    block.mineBlock(this.difficulty);
    console.log("Block is mined");
    const prevBlock = this.chain[this.chain.length - 1];
    block.previousHash = prevBlock.hash;
    this.chain.push(block);
    this.pendingTransaction = [
      new Transaction(null, miningRewardAddress, this.miningReward),
    ];
  }

  createTransaction(transaction) {
    this.pendingTransaction.push(transaction);
  }

  getBalanceOfAddress(address) {
    let balance = 0;
    for (const block of this.chain) {
      for (const trans of block.transaction) {
        if (trans.fromAddress === address) {
          balance -= trans.amount;
        }
        if (trans.toAddress === address) {
          balance += trans.amount;
        }
      }
    }
    return balance;
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
shivamCoin.createTransaction("address1", "address2", 100);
shivamCoin.createTransaction("address2", "address3", 10);
console.log("Mining started.....");
shivamCoin.minePendingTransaction("shivam-miner");
console.log(shivamCoin.getBalanceOfAddress("shivam-miner"));
shivamCoin.minePendingTransaction("shivam-miner");
console.log(shivamCoin.getBalanceOfAddress("shivam-miner"));
