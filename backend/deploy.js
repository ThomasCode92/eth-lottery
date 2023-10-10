const HDWalletProvider = require('@truffle/hdwallet-provider');
const { Web3 } = require('web3');
const dotenv = require('dotenv');

const { abi, evm } = require('./compile');

// Load Environment variables
const { parsed } = dotenv.config();
const { ACCOUNT_MNEMONIC, INFURA_URL } = parsed;

// Setting up a Provider and Web3 instance
const provider = new HDWalletProvider(ACCOUNT_MNEMONIC, INFURA_URL);
const web3 = new Web3(provider);

// Deploy the Contract to a Network
const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(abi)
    .deploy({ data: evm.bytecode.object, arguments: [] })
    .send({ gas: '1000000', from: accounts[0] });

  console.log('Contract deployed to', result.options.address);

  return provider.engine.stop();
};

deploy();
