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

describe('Lottery Contract', () => {
  test('should deploy a contract', () => {
    expect(lottery.options.address).toBeDefined();
  });

  test('should allow one account to enter', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.02', 'ether'),
    });

    const players = await lottery.methods
      .getPlayers()
      .call({ from: accounts[0] });

    expect(players.length).toBe(1);
    expect(players[0]).toBe(accounts[0]);
  });

  test('should allow multiple accounts to enter', async () => {
    for (let i = 0; i < 3; i++) {
      await lottery.methods.enter().send({
        from: accounts[i],
        value: web3.utils.toWei('0.02', 'ether'),
      });
    }

    const players = await lottery.methods
      .getPlayers()
      .call({ from: accounts[0] });

    expect(players.length).toBe(3);

    for (let i = 0; i < 3; i++) {
      expect(players[i]).toBe(accounts[i]);
    }
  });

  test('should require a minimum amount of ether to enter', async () => {
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: 200,
      });
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  test('should allow only the manager to pick a winner', async () => {
    try {
      await lottery.methods.pickWinner().send({ from: accounts[1] });
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  test('should send money to the winner and reset the player array', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('2', 'ether'),
    });

    const initialBalance = await web3.eth.getBalance(accounts[0]);

    await lottery.methods.pickWinner().send({ from: accounts[0] });

    const finalBalance = await web3.eth.getBalance(accounts[0]);
    const difference = finalBalance - initialBalance;

    const players = await lottery.methods
      .getPlayers()
      .call({ from: accounts[0] });

    const lotteryBalance = await web3.eth.getBalance(lottery.options.address);

    expect(players.length).toBe(0);
    expect(Number(lotteryBalance)).toBe(0);
    expect(Number(difference)).toBeGreaterThan(
      Number(web3.utils.toWei('1.8', 'ether')),
    );
  });
});
