pragma solidity ^0.4.25 ;
import './TokenStorage.sol';
import './Owned.sol';
import './DataOwned.sol';

/**
 * @title ERTToken.sol
 * @dev Proxy contract that delegates calls to a dedicated ERC20 implementation
 * contract. The needed data here are implementation address and owner.
 */
contract ERTToken is TokenStorage, Owned {

    /**
     * @param _implementationAddress First version of the ERC20 Token implementation address
     * @param _dataAddress First version of data contract address
     */
    constructor(address _implementationAddress, address _dataAddress) public{
        require(_dataAddress != address(0));
        require(_implementationAddress != address(0));

        // Set implementation address and version
        version = 1;
        implementationAddress = _implementationAddress;

        // Set data address
        super._setDataAddress(1, _dataAddress);
    }

    /**
     * @dev Called for all calls that aren't implemented on proxy, like
     * ERC20 methods. This is payable to enable owner to give money to
     * the ERC20 contract
     */
    function() payable external{
      _delegateCall(implementationAddress);
    }

    /**
     * @dev Delegate call to ERC20 contract
     */
    function _delegateCall(address _impl) private{
      assembly {
         let ptr := mload(0x40)
         calldatacopy(ptr, 0, calldatasize)
         let result := delegatecall(gas, _impl, ptr, calldatasize, 0, 0)
         let size := returndatasize
         returndatacopy(ptr, 0, size)

         switch result
         case 0 { revert(ptr, size) }
         default { return(ptr, size) }
      }
    }

}
