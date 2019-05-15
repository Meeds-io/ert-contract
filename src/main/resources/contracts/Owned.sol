pragma solidity ^0.4.25 ;
import './TokenStorage.sol';

/**
 * @title Owned.sol
 * @dev Abstract contract to determine ownership of the contract
 */
contract Owned is TokenStorage {

    // Event emitted when owner changes
    event TransferOwnership(address newOwner);

    /**
     * @dev Made internal because this contract is abstract
     */
    constructor() internal{
        owner = msg.sender;
    }

    /**
     * @dev a modifier to check if the transaction issuer is the owner
     */
    modifier onlyOwner(){
        require(msg.sender == owner);
        _;
    }

    /**
     * @dev Modifies the owner of the contract
     * @param _newOwner new owner
     */
    function transferOwnership(address _newOwner) public onlyOwner{
        if (_newOwner != address(0)) {
            owner = _newOwner;
            emit TransferOwnership(_newOwner);
        }
    }
}
