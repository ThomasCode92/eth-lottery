import web3 from './utils/web3';

import './App.css';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    const listAccounts = async () => {
      return await web3.eth.getAccounts();
    };

    listAccounts().then(console.log);
  }, []);

  return <div></div>;
}

export default App;
