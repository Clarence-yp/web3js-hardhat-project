const { recoverAddress } = require("ethers/lib/utils")
const Web3 = require("web3")
const rpcURL = 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161' // Your RCkP URL goes here 
const web3 = new Web3(rpcURL);
const address = '0xb921A6d8c8A909Ef991943f01F86Fd70a6606948'; // Your account address goes here 
web3.eth.getBalance(address, (err, wei) => { balance = web3.utils.fromWei(wei, 'ether'); console.log(balance)});
// converts wei to ether 