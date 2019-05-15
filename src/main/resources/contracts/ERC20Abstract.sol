pragma solidity ^0.4.25 ;
import "./SafeMath.sol";
import "./DataAccess.sol";

/**
 * @title ERC20Abstract.sol
 * @dev An abstract contract to define internally a common operation
 * with a common logic for transfer operation
 */
contract ERC20Abstract is DataAccess, SafeMath {

    // Event emited when a token transfer happens is made
    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    // Event emited when a token transfer Approval is made
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

    /**
     * @dev Made internal because this contract is abstract
     */
    constructor() internal{
    }

    /**
     * @dev Transfers an amount of ERC20 tokens from an address to another.
     * @param _from address of sender
     * @param _to address of receiver
     * @param _value amount of tokens to transfer
     * @return true if the transfer completed successfully
     */
    function _transfer(address _from, address _to, uint _value) internal returns (bool){
        // Prevent transfer transaction with no tokens
        require(_value > 0);
        // Prevent transfer to 0x address. Use burn() instead
        require(_to != address(0));
        // Check if the sender has enough
        uint256 fromBalance = super._balanceOf(_from);
        require(fromBalance >= _value);
        // Subtract from the sender
        super._setBalance(_from, super.safeSubtract(fromBalance, _value));
        // Add the same to the recipient
        super._setBalance(_to, super.safeAdd(super._balanceOf(_to), _value));
        return true;
    }
}
