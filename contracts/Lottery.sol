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

    function pickWinner() public restricted {
        uint randomIdx = random() % players.length;
        address payable winner = payable(players[randomIdx]);

        winner.transfer(address(this).balance);

        players = new address[](0);
    }

    function random() private view returns (uint) {
        bytes32 hash = keccak256(
            abi.encodePacked(block.difficulty, block.timestamp, players)
        );

        return uint(hash);
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
}
