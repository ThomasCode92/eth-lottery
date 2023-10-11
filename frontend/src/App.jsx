import { Fragment, useEffect, useState } from 'react';

import web3 from './utils/web3';
import lottery from './utils/lottery';

import './App.css';

function App() {
  const [manager, setManager] = useState('');

  useEffect(() => {
    const fetchManager = async () => {
      try {
        const managerAddress = await lottery.methods.manager().call();
        setManager(managerAddress);
      } catch (error) {
        console.error('Error fetching manager:', error);
      }
    };

    fetchManager();
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
        </section>
      </main>
    </Fragment>
  );
}

export default App;
