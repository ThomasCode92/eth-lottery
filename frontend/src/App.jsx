import { Fragment, useEffect, useState } from 'react';

import web3 from './utils/web3';
import lottery from './utils/lottery';

import './App.css';

function App() {
  const [manager, setManager] = useState('');
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState('');
  const [value, setValue] = useState('');

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
          <form>
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
        </section>
      </main>
    </Fragment>
  );
}

export default App;
