const path = require('path');
const fs = require('fs');

const solc = require('solc');

const lotteryPath = path.resolve(__dirname, 'contracts', 'Lottery.sol');
const source = fs.readFileSync(lotteryPath, 'utf-8');

const input = {
  language: 'Solidity',
  sources: { 'Lottery.sol': { content: source } },
  settings: {
    outputSelection: {
      '*': { '*': ['*'] },
    },
  },
};

const compiledOutput = JSON.parse(solc.compile(JSON.stringify(input)));
const compiledContract = compiledOutput.contracts['Lottery.sol'];

module.exports = compiledContract.Lottery;
