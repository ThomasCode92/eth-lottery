import { Fragment, useEffect, useState } from 'react';

import web3 from './utils/web3';
import lottery from './utils/lottery';

import './App.css';

function App() {
  const [manager, setManager] = useState('');
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState('');
  const [value, setValue] = useState('');
  const [enterMessage, setEnterMessage] = useState('');
  const [winnerMessage, setWinnerMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [managerAddress, playerAddresses, lotteryBalance] =
          await Promise.all([
            lottery.methods.manager().call(),
            lottery.methods.getPlayers().call(),
            web3.eth.getBalance(lottery.options.address),
          ]);

        setManager(managerAddress);
        setPlayers(playerAddresses);
        setBalance(lotteryBalance);
      } catch (error) {
        console.error('Error fetching contract data:', error);
      }
    };

    fetchData();
  }, []);

  const submitHandler = async event => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    setEnterMessage('Waiting on transaction success...');

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(value, 'ether'),
      data: lottery.methods.enter().encodeABI(),
    });

    setValue('');
    setEnterMessage('You have been entered!');
  };

  const pickWinnerHandler = async () => {
    const accounts = await web3.eth.getAccounts();

    setWinnerMessage('Waiting on transaction success...');

    await lottery.methods.pickWinner().send({
      from: accounts[0],
      data: lottery.methods.pickWinner().encodeABI(),
    });

    setWinnerMessage('A winner has been picked!');
  };

  return (
    <Fragment>
      <header>
        <h1>Eth Lottery</h1>
      </header>
      <main>
        <section>
          <h2>Lottery Contract</h2>
          <p>This contract is managed by {manager}</p>
          <p>
            There are currently {players.length} people entered, competing to
            win {web3.utils.fromWei(balance, 'ether')} ether!
          </p>
        </section>
        <hr />
        <section>
          <h2>Want to try your luck?</h2>
          <form onSubmit={submitHandler}>
            <div>
              <label htmlFor="ethAmount">Amount of ether to enter</label>
              <input
                id="ethAmount"
                type="number"
                value={value}
                onChange={event => setValue(event.target.value)}
              />
            </div>
            <button>Enter</button>
          </form>
          <p>{enterMessage}</p>
        </section>
        <hr />
        <section>
          <h2>Ready to pick a winner</h2>
          <button onClick={pickWinnerHandler}>Pick a winner</button>
          <p>{winnerMessage}</p>
        </section>
      </main>
    </Fragment>
  );
}

export default App;
