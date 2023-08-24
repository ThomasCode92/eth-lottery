// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Lottery {
    address public manager;
    address[] public players;

    constructor() {
        manager = msg.sender;
    }

    function enter() public payable {
        require(msg.value > .01 ether, 'Send not enough ETH');

        players.push(msg.sender);
    }
}
