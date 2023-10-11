import web3 from './web3';
import abi from '../data/abi.json';

const address = '0xA68284e586904418D5663D9d59AAf3FFE614769F';
const contract = new web3.eth.Contract(abi, address);

export default contract;
