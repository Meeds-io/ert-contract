pragma solidity ^0.4.25 ;
import "./Admin.sol";
import "./DataAccess.sol";

/**
 * @title ApprouvableAccount.sol
 * @dev This is an abstract contract that is used to approve and disapprove addresses.
 * The modifier whenApproved is used from ERC20 Token contract to test if the receiver
 * and sender are approved accounts or not. This mechanism will avoid to send accidently
 * tokens outside a known community of users.
 */
contract ApprouvableAccount is DataAccess, Admin {

    // emitted only when a disapproved account is approved
    event ApprovedAccount(address target);

    // emitted only when a approved account is disapproved
    event DisapprovedAccount(address target);

    /**
     * @dev Made internal because this contract is abstract
     */
    constructor() internal{
    }

    /**
     * @dev Modifier to make a function callable only when
     * the address is approved 
     * @param _target address to test its approval status
     */
    modifier whenApproved(address _target){
        require(super._isApprovedAccount(_target));
        _;
    }

    /**
     * @dev Sets an account as approved to receive and send ERC20 tokens
     * @param _target address to approve
     */
    function approveAccount(address _target) public onlyAdmin(4){
        // Shouldn't approve a contract address
        require(!_isContract(_target));

        if (!super._isApprovedAccount(_target)) {
            super._setApprovedAccount(_target, true);
            emit ApprovedAccount(_target);
        }
    }

    /**
     * @dev Sets an account as disapproved to receive and send ERC20 tokens
     * @param _target address to disapprove
     */
    function disapproveAccount(address _target) public onlyAdmin(4){
        // If the address is an admin, disapproving it shouldn't work
        // until revoking its privileges
        require (!super.isAdmin(_target, 1));
        if (super._isApprovedAccount(_target)) {
            super._setApprovedAccount(_target, false);
            emit DisapprovedAccount(_target);
        }
    }

    /**
     * @dev Checks if an address is approved to receive and send ERC20 tokens
     * @param _target address to check if it's approved
     * @return true is the address is approved
     */
    function isApprovedAccount(address _target) public view returns (bool){
        return super.isAdmin(_target, 1) || super._isApprovedAccount(_target);
    }

    function _isContract(address _addr) internal view returns (bool){
        uint32 size;
        assembly {
          size := extcodesize(_addr)
        }
        return (size > 0);
    }

}
