pragma solidity ^0.4.25 ;
import "./Owned.sol";
import "./DataAccess.sol";

/**
 * @title Admin.sol
 * @dev This is an abstract contract that is used to manage administrators of the Token
 */
contract Admin is Owned, DataAccess {

    // Event emitted when the admin is granted with a given level of hbilitation
    event AddedAdmin(address target, uint8 level);

    // Event emitted when an admin privileges has been revoked
    event RemovedAdmin(address target);

    /**
     * @dev Made internal because this contract is abstract
     */
    constructor() internal{
    }

    /**
     * @dev adding an admin with a priveleges level
     * @param _target admin address
     * @param _level habilitation level
     */
    function addAdmin(address _target, uint8 _level) public onlyAdmin(5){
        // The owner has already all privileges, thus when ownership
        // is transferred, the old owner shouldn't have privileges
        // only if the new owner explicitely changes it
        require (owner != _target);

        // Admin levels from 1 to 5 only
        require(_level > 0 && _level <= 5);
        if (_target != address(0)) {
            super._setAdmin(_target, _level);
            emit AddedAdmin(_target, _level);
        }
    }

    /**
     * @dev Revoke an admin priveleges
     * @param _target admin address to remove
     */
    function removeAdmin(address _target) public onlyAdmin(5){
        // An admin shouldn't be able to dele himself
        require(msg.sender != _target);
        if (super._isAdmin(_target, 1)) {
            super._setAdmin(_target, 0);
            emit RemovedAdmin(_target);
        }
    }

    /**
     * @dev check if the user is an admin with the given level
     * @param _target admin address
     * @param _level habilitation level
     * @return true if the account is admin with the dedicated level
     */
    function isAdmin(address _target, uint8 _level) public view returns (bool){
        return owner == _target || super._isAdmin(_target, _level);
    }

    /**
     * @dev check if the user is an admin with the given level
     * @param _target admin address
     * @return habilitation level
     */
    function getAdminLevel(address _target) public view returns (uint8){
        if(owner == _target) {
            return 5;
        } else {
            return super._getAdminLevel(_target);
        }
    }

    // A modifier that checks if the msg.sender has an habilitation with the given level
    modifier onlyAdmin(uint8 _level){
        require(isAdmin(msg.sender, _level));
        _;
    }
}
