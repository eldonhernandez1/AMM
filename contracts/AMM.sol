// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Token.sol";

// [X] Manage Pool
// [X] Manage Deposits
// [X] Facilate Swaps (i.e. Trades)
// [X]  Manage Withdrawals

contract AMM {
   Token public Token1;
   Token public Token2;

   uint256 public token1Balance;
   uint256 public token2Balance;
   uint256 public K;

   uint256 public totalShares;
   mapping(address => uint256) public shares;
   uint256 constant PRECISION = 10**18;

   event Swap(
    address user,
    address tokenGive,
    uint256 tokenGiveAmount,
    address tokenGet,
    uint256 tokenGetAmount,
    uint256 token1Balance,
    uint256 token2Balance,
    uint256 timestamps
   );

   constructor(Token _token1, Token _token2) {
    Token1 = _token1;
    Token2 = _token2;

    // Initialize variables
    token1Balance = 0;
    token2Balance = 0;
    K = 0;
    totalShares = 0;
   }

   function addLiquidity(uint256 _token1Amount, uint256 _token2Amount) external {
    // Deposit Tokens
    require(Token1.transferFrom(msg.sender, address(this), _token1Amount), "failed to transfer token 1");
    require(Token2.transferFrom(msg.sender, address(this), _token2Amount), "failed to transfer token 2");

    // Issue Shares
    uint256 share;

        // If first time adding liquidity, make share 100
        if (totalShares == 0) {
            share = 100 * PRECISION;
        } else {
            uint256 share1 = (totalShares * _token1Amount) / token1Balance;
            uint256 share2 = (totalShares * _token2Amount) / token2Balance;
            require(
                (share1 / 10**3) == (share2 / 10**3),
                "must provide equal token amounts"
            );
            share = share1;
        }

    // Manage Pool
    token1Balance += _token1Amount;
    token2Balance += _token2Amount;
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

    // Returns amount of token2 received when swapping token1
    function calculateToken1Swap(uint256 _token1Amount) 
        public
        view
        returns (uint256 token2Amount)
    { 
        uint256 token1After = token1Balance + _token1Amount;
        uint256 token2After = K / token1After;
        token2After = token2Balance - token2After;

        // Don't let pool go to zero
        if(token2Amount == token2Balance) {
            token2Amount --;
        }

        require(token2Amount < token2Balance, "swap amount is too large");
    }
    // Token1 Functionality
    function swapToken1(uint256 _token1Amount) 
        external 
        returns(uint256 token2Amount)
    {
        // Calculate Token 2 Amount
        token2Amount = calculateToken1Swap(_token1Amount);

        // Do the swap
        // 1. Transfer tokens out of user wallet
        Token1.transferFrom(msg.sender, address(this), _token1Amount);
        // 2. Update the token balance in the contract
        token1Balance += _token1Amount;
        // 3. Update the token2 balance in the contract
        token2Balance -= token2Amount;
        // 4. Transfer token2 tokens from contract to user wallet
        Token2.transfer(msg.sender, token2Amount);

        // Emit an event
        emit Swap(
            msg.sender,
            address(Token1),
            _token1Amount,
            address(Token2),
            token2Amount,
            token1Balance,
            token2Balance,
            block.timestamp
        );
    }
    // Returns amount of token1 received when swapping token2
    function calculateToken2Swap(uint256 _token2Amount) 
        public
        view
        returns (uint256 token1Amount)
    { 
        uint256 token2After = token2Balance + _token2Amount;
        uint256 token1After = K / token2After;
        token1After = token1Balance - token1After;

        // Don't let pool go to zero
        if(token1Amount == token1Balance) {
            token1Amount --;
        }

        require(token1Amount < token1Balance, "swap amount is too large");
    }
    // Token 2 Functionality
     function swapToken2(uint256 _token2Amount) 
        external 
        returns(uint256 token1Amount)
    {
        // Calculate Token 1 Amount
        token1Amount = calculateToken2Swap(_token2Amount);

        // Do the swap
        // 1. Transfer tokens out of user wallet
        Token2.transferFrom(msg.sender, address(this), _token2Amount);
        // 2. Update the token balance in the contract
        token2Balance += _token2Amount;
        // 3. Update the token2 balance in the contract
        token1Balance -= token1Amount;
        // 4. Transfer token2 tokens from contract to user wallet
        Token1.transfer(msg.sender, token1Amount);

        // Emit an event
        emit Swap(
            msg.sender,
            address(Token2),
            _token2Amount,
            address(Token1),
            token1Amount,
            token1Balance,
            token2Balance,
            block.timestamp
        );
    }
    // Determine how many tokens will be withdrawn
    function calculateWithdrawAmount (uint256 _share)
        public
        view
        returns(uint256 token1Amount, uint256 token2Amount)
    {
        require(_share <= totalShares, "must be less than total shares");
        token1Amount = (_share * token1Balance) / totalShares;
        token2Amount = (_share * token2Balance) / totalShares;
    }

    // Removes liquidity from the pool
    function removeLiquidity(uint256 _share) 
    external
    returns(uint256 token1Amount, uint256 token2Amount) 
        {
        require(
            _share <= shares[msg.sender],
            "cannot withdraw more shares than you have"
        );
        (token1Amount, token2Amount) = calculateWithdrawAmount(_share);

        shares[msg.sender] -= _share;
        totalShares -= _share;

        token1Balance -= token1Amount;
        token2Balance -= token2Amount;
        K = token1Balance * token2Balance;

        Token1.transfer(msg.sender, token1Amount);
        Token2.transfer(msg.sender, token2Amount);
    }
}