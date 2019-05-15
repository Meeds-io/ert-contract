pragma solidity ^0.4.25 ;
import './DataOwned.sol';

/**
 * @title TokenStorage.sol
 * @dev This is an abstract contract that holds the variables that are shared between
 * implementation and Proxy contracts
 */
contract TokenStorage {

    /**
     * @dev Made internal because this contract is abstract
     */
    constructor() internal{
    }

    // Reference to the Token implementation reference
    address public implementationAddress;

    // Proxy and Token owner address
    address public owner;

    // A local variable for each Token instance to pause old and useless
    // implementations when upgrading to a newer Token implementation version
    bool public paused;

    // Current implementation version
    uint16 public version;

    // Map of data contracts by version number
    mapping(uint16 => address) internal dataAddresses_;

    // An array of data versions
    uint16[] internal dataVersions_;

    /**
     * @dev sets a new data contract address by version.
     * Only new versions are accepted to avoid overriding an existing reference to a version
     * (only contract owner can set it)
     * @param _dataVersion version number of data contract
     * @param _dataAddress address of data contract
     */
    function _setDataAddress(uint16 _dataVersion, address _dataAddress) internal{
        // Make sure that we can't change a reference of an existing data reference
        if(dataAddresses_[_dataVersion] == address(0)) {
            dataAddresses_[_dataVersion] = _dataAddress;
            dataVersions_.push(_dataVersion);
        }
    }

    /**
     * @dev returns the data contract address switch version.
     * Each time a new contract version is added, it can be added
     * to dataAddress map indexed by the version number.
     * The code implementation can be changed consequently by referencing
     * the new data contract address, for example change getDataAddress(1)
     * by getDataAddress(2)
     * @return the corresponding data contract address to the indicated version
     */
    function getDataAddress(uint16 _version) public view returns(address){
        return dataAddresses_[_version];
    }

}
