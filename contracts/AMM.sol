// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Token.sol";

// [] Manage Pool
// [] Manage Deposits
// [] Faciliate Swaps (ie: Trades)
// [] Manage Withdrawls

contract AMM {
   Token public Token1;
   Token public Token2;

   constructor(Token _token1, Token _token2) {
    Token1 = _token1;
    Token2 = _token2;
   }

function addLiquidity(uint256 _token1Amount, uint256 _token2Amount) external {
    // Deposit Tokens
    require(
        Token1.transferFrom(msg.sender, address(this), _token1Amount), 
        "failed to transfer token 1"
    );

    require(
        Token2.transferFrom(msg.sender, address(this), _token2Amount), 
        "failed to transfer token 2"
    );

    // Issue Shares

    // Manage Pool
}

}
