const ganache = require('ganache');
const { Web3 } = require('web3');

const { abi, evm } = require('../compile');

const { provider } = ganache;
const web3 = new Web3(provider());

let accounts;
let lottery;

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();

  // Use one of those accounts to deploy the contract
  lottery = await new web3.eth.Contract(abi)
    .deploy({ data: evm.bytecode.object })
    .send({ from: accounts[0], gas: '1000000' });
});
