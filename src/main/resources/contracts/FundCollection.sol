pragma solidity ^0.4.25 ;
import "./Admin.sol";

/**
 * @title FundCollection.sol
 * @dev Used to receive ether from owner only to pay gas
 */
contract FundCollection is Admin {

    // Event emitted when the owner deposits ether on contract
    event DepositReceived(address from, uint amount);

    /**
     * @dev Made internal because this contract is abstract
     */
    constructor() internal{
    }

    /**
     * @dev receive funds from owner to pay necessary gas for ERC20 methods
     * (see GasPayableInToken.sol)
     */
    function() external payable onlyAdmin(5) {
        require(msg.data.length == 0);
        require(msg.value > 0);
        emit DepositReceived(msg.sender, msg.value);
    }
}
