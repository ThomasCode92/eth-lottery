import { useEffect } from 'react';

import web3 from './utils/web3';
import lottery from './utils/lottery';

import './App.css';

function App() {
  useEffect(() => {
    const listAccounts = async () => {
      return await web3.eth.getAccounts();
    };

    listAccounts().then(accounts => {
      console.log('Account', accounts[0]);
      console.log('Lottery', lottery);
    });
  }, []);

  return <div></div>;
}

export default App;
