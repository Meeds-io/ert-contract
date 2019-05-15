pragma solidity ^0.4.25 ;
import './DataOwned.sol';

/**
 * @title ERTTokenDataV2.sol
 * @dev Data contract for Specific reward, vesting and account initialization fields
 */
contract ERTTokenDataV2 is DataOwned {

    // Specific field for vested tokens
    mapping (address => bool) internal initializedAccounts_;

    // Specific field for rewards balances
    mapping (address => uint256) internal rewards_;

    // Specific field for vested tokens
    mapping (address => uint256) internal vested_;

    constructor(address _proxyAddress, address _implementationAdress) public{
        proxy = _proxyAddress;
        implementation = _implementationAdress;
    }

    function() external {
        revert();
    }

    /**
     * @dev mark address as initialized
     * @param _target addres to mark as initialized
     */
    function setInitializedAccount(address _target) public onlyContracts {
        initializedAccounts_[_target] = true;
    }

    /**
     * @return true if the address has been already initialized before
     */
    function isInitializedAccount(address _target) public view returns(bool) {
        return initializedAccounts_[_target];
    }

    /**
     * @param _target addres to return its reward balance
     * @return reward balance of the given address
     */
    function rewardBalanceOf(address _target) public view returns(uint256) {
        return rewards_[_target];
    }

    /*
     * @dev Sets a reward balance for a given address
     * @param _target account address to change its reward balance
     * @param _balance new reward balance
     */
    function setRewardBalance(address _target, uint256 _balance) public onlyContracts {
        rewards_[_target] = _balance;
    }

    /**
     * @param _target addres to return its reward balance
     * @return reward balance of the given address
     */
    function vestingBalanceOf(address _target) public view returns(uint256) {
        return vested_[_target];
    }

    /*
     * @dev Sets a tokens balance for a given address
     * @param _target account address to change its balance
     * @param _balance new balance
     */
    function setVestingBalance(address _target, uint256 _balance) public onlyContracts {
        vested_[_target] = _balance;
    }

}
