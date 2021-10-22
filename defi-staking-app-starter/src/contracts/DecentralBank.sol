pragma solidity ^0.5.0;

import "./RWD.sol";
import "./Tether.sol";

contract DecentralBank {
    string public name = "Decentral Bank";
    address public owner;
    Tether public tether;
    RWD public rwd;

    address[] public stakers;

    mapping(address => uint256) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(RWD _rwd, Tether _tether) public {
        rwd = _rwd;
        tether = _tether;
        owner = msg.sender;
    }

    function depositTokens(uint256 _amount) public {
        // Require the staking amount to be greater than 0
        require(_amount > 0, "The amount can not be 0");

        // Transfer tether tokens to this contract address for staking
        tether.transferFrom(msg.sender, address(this), _amount);

        // Update staking balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        // check if they have staked
        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        // Update Staking Balance
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    // Issue Rewards
    function issueTokens() public {
        // Require only the owner ot issue tokens
        require(msg.sender == owner, "Caller must be contract owner");
        for (uint256 i = 0; i < stakers.length; i++) {
            address recipient = stakers[i];
            // reward is the amount that the recipient is staking
            uint256 balance = stakingBalance[recipient] / 9; // divide by 9 to create incentive for stakers
            if (balance > 0) {
                rwd.transfer(recipient, balance);
            } // end of if loop
        } //  end of for loop
    } // end of issueTokens function

    // Unstake Tokens
    function unstakeTokens() public {
        uint256 balance = stakingBalance[msg.sender];

        // Require amount to be greater than zero
        require(balance > 0, "Staking Balance Cant be Less Than Zero");

        // Transfer tokens to the specified contract address from our bank
        tether.transfer(msg.sender, balance);

        // Reset Staking Balance
        stakingBalance[msg.sender] = 0;

        // Update Staking Status
        isStaking[msg.sender] = false;
    }
}
