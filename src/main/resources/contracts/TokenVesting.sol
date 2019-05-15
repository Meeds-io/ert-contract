pragma solidity ^0.4.25 ;
import "./ERTTokenV1.sol";

/**
 * @title TokenVesting.sol
 * @dev Token vesting for accounts. The vested amount could be transferred
 * to a not approved account
 */
contract TokenVesting is ERTTokenV1 {

    // Event emited when an address has been vested an amount
    event Vesting(address indexed _target, uint256 _tokenAmount);

    // Event emited when a token transfer is made using vested token amount
    event VestingTransfer(address indexed _from, address indexed _to, uint256 _value);

    constructor () internal {
    }

    /**
     * @dev add `_value` token amount to `_to` as vested
     * 
     * @param _target The address of the recipient
     * @param _value The amount of token to be vested
     */
    function transformToVested(address _target, uint256 _value) public onlyAdmin(3) whenNotPaused whenApproved(_target) {
        // Make sure that the transaction is not made for nothing
        require(_value > 0);

        uint256 newVestedBalance = super.safeAdd(super.vestingBalanceOf(_target), _value);

        // Ensure that vesting balance is less than current token balance of target user
        require(newVestedBalance <= super.balanceOf(_target));

        // Add the new vested balance to the recipient
        super._setVestingBalance(_target, newVestedBalance);

        // Emit a specific event for vesting operation
        emit Vesting(_target, _value);
    }

    function _transferVesting(address _to, uint256 _value) internal {
        // Test if not approved account, then deduct amount from vested balance
        uint256 vestingBalance = super.vestingBalanceOf(msg.sender);
        require(vestingBalance >= _value);
        super._setVestingBalance(msg.sender, super.safeSubtract(vestingBalance, _value));
        super._setVestingBalance(_to, super.safeAdd(super.vestingBalanceOf(_to), vestingBalance));

        emit VestingTransfer(msg.sender, _to, _value);
    }

    function _adjustVestingBalance(address _target) internal {
        // Make sure that vested balance is <= token balance
        uint256 newTokenBalance = super.balanceOf(_target);
        if (newTokenBalance < super.vestingBalanceOf(_target)) {
            super._setVestingBalance(msg.sender, newTokenBalance);
        }
    }

}
