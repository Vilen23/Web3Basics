import { BlockChain, Transaction } from "./blockchain.js";
import elliptic from "elliptic";

const EC = elliptic.ec;
const ec = new EC("secp256k1");

const myKey = ec.keyFromPrivate('b6a8fc5406e33f55036a0a5483516559e51b0f6b443bcd619a95b5df2cfa2b93');
const myWalletAddress = myKey.getPublic('hex');

let shivamCoin = new BlockChain();

const transaction1 = new Transaction(myWalletAddress,"fakeaddress",10);
transaction1.signInTransaction(myKey);
shivamCoin.addTransaction(transaction1);

shivamCoin.minePendingTransaction(myWalletAddress);
console.log(shivamCoin.getBalanceOfAddress(myWalletAddress));

