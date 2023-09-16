// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Token.sol";

contract AMM {
   Token public Token1;
   Token public Token2;
   Token public Token3;

   uint256 public token1Balance;
   uint256 public token2Balance;
   uint256 public token3Balance;
   uint256 public K;

   uint256 public totalShares;
   mapping(address => uint256) public shares;
   uint256 constant PRECISION = 10**18;

   constructor(Token _token1, Token _token2, Token _token3) {
    Token1 = _token1;
    Token2 = _token2;
    Token3 = _token3;

    // Initialize variables
    token1Balance = 0;
    token2Balance = 0;
    token3Balance = 0;
    K = 0;
    totalShares = 0;
   }

   function addLiquidity(uint256 _token1Amount, uint256 _token2Amount, uint256 _token3Amount) external {
    // Deposit Tokens
    require(Token1.transferFrom(msg.sender, address(this), _token1Amount), "failed to transfer token 1");
    require(Token2.transferFrom(msg.sender, address(this), _token2Amount), "failed to transfer token 2");
    require(Token3.transferFrom(msg.sender, address(this), _token3Amount), "failed to transfer token 3");

    // Issue Shares
    uint256 share;

    // If first time adding liquidity, make share 100
    if (totalShares == 0) {
        share = 100 * PRECISION;
    } else {
        uint256 share1 = (totalShares * _token1Amount) / token1Balance;
        uint256 share2 = (totalShares * _token2Amount) / token2Balance;
        uint256 share3 = (totalShares * _token3Amount) / token3Balance;

        // Check for division by zero and equality
        require(token1Balance != 0 && token2Balance != 0 && token3Balance != 0, "Division by zero");
        require(share1 == share2 && share1 == share3, "must provide equal token amount");

        share = share1;
    }

    // Manage Pool
    token1Balance += _token1Amount;
    token2Balance += _token2Amount;
    token3Balance += _token3Amount;

    K = token1Balance * token2Balance;

    // Updates shares
    totalShares += share;
    shares[msg.sender] += share;
   }

   // Determine how many token2 tokens must be deposited when depositing liquidity for token1
    function calculateToken2Deposit(uint256 _token1Amount) 
        public 
        view 
        returns (uint256 token2Amount) 
    {
        token2Amount = (token2Balance * _token1Amount) / token1Balance;
    }

   // Determine how many token1 tokens must be deposited when depositing liquidity for token2
    function calculateToken1Deposit(uint256 _token2Amount) 
        public 
        view 
        returns (uint256 token1Amount) 
    {
        token1Amount = (token1Balance * _token2Amount) / token2Balance;
    }
}
