import sha256 from "crypto-js/sha256.js";
import elliptic from "elliptic";
const EC = elliptic.ec;
const ec = new EC("secp256k1");

export class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }

  calculateHash() {
    return sha256(this.fromAddress + this.toAddress + this.amount).toString();
  }

  signInTransaction(signInKey) {
    if (signInKey.getPublic("hex") !== this.fromAddress) {
      throw new Error("You cannot sign transactions for other wallets");
    }
    const hash = this.calculateHash();
    const sign = signInKey.sign(hash, "base64");
    this.signature = sign.toDER("hex");
  }

  isValid() {
    if (this.fromAddress === null) return true;
    if (!this.signature || !this.signature.length === 0) {
      throw new Error("No signature in this transaction");
    }
    const publicKey = ec.keyFromPublic(this.fromAddress, "hex");
    return publicKey.verify(this.calculateHash(), this.signature);
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

  hasValidTransaction() {
    for (const trans of this.transaction) {
      if (!trans.isValid()) return false;
    }
    return true;
  }
}

export class BlockChain {
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
    const rewardTransaction = new Transaction(
      null,
      miningRewardAddress,
      this.miningReward
    );
    this.pendingTransaction.push(rewardTransaction);

    let block = new Block(new Date(), this.pendingTransaction);
    block.mineBlock(this.difficulty);
    console.log("Block is mined");

    const prevBlock = this.chain[this.chain.length - 1];
    block.previousHash = prevBlock.hash;
    this.chain.push(block);

    this.pendingTransaction = [];
  }

  addTransaction(transaction) {
    if (!transaction.fromAddress || !transaction.toAddress) {
      throw new Error("Transaction must have from and to address");
    }
    if (!transaction.isValid()) {
      throw new Error("You cannot add new transaction in the chain");
    }
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
      if (!current.hasValidTransaction()) return false;
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
