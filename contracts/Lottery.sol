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

    function pickWinner() public {}

    function random() private view returns (uint) {
        bytes32 hash = keccak256(
            abi.encodePacked(block.difficulty, block.timestamp, players)
        );

        return uint(hash);
    }
}
