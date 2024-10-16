import elliptic from "elliptic";
const EC = elliptic.ec;
const ec = new EC("secp256k1");

const key = ec.genKeyPair();
const privateKey = key.getPrivate('hex');
const publicKey = key.getPublic('hex');

console.log("Private",privateKey)
console.log("Public",publicKey)