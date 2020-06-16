/*
 * This file is part of the Meeds project (https://meeds.io/).
 * Copyright (C) 2020 Meeds Association
 * contact@meeds.io
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
pragma solidity ^0.5.0;

import "./Owned.sol";
import "./DataOwned.sol";

/*
 * @title Upgradability
 * @dev This contract will allow to do Data and Impl upgrade operations
 */
contract Upgradability is Owned{
    // Event emitted when an upgrade is made to a new implementation
    event Upgraded(uint16 implementationVersion, address implementationAddress);
    // Event emitted when an upgrade is made to a new data
    event UpgradedData(uint16 dataVersion, address dataAddress);

    /**
     * @dev Made internal because this contract is abstract
     */
    constructor() internal{
    }

    /**
     * @dev Upgrade to a new implementation of ERC20 contract
     * @param _proxy proxy contract address
     * @param _version the version of the new implementation that should be higher
     * that current version
     * @param _newImplementation new ERC20 contract address
     */
    function upgradeImplementation(address _proxy, uint16 _version, address _newImplementation) public onlyOwner{
        // To ensure that the owner doesn't call this method from implementation directly
        // but through Proxy contract
        require(version > 0);
        require(_version > version);
        require(implementationAddress != _newImplementation);
        version = _version;
        implementationAddress = _newImplementation;
        for (uint16 i = 0; i< dataVersions_.length; i++){
            _transferDataOwnership(dataVersions_[i], _proxy, _newImplementation);
        }
        emit Upgraded(_version, _newImplementation);
    }

    /**
     * @dev NOTE: Depricated (should use upgradeData and upgradeImplementation in separate transactions).
     *      Upgrade to a new implementation of ERC20 contract
     * @param _proxy proxy contract address
     * @param _version the version of the new implementation that should be higher
     * that current version
     * @param _newImplementation new ERC20 contract address
     * @param _dataVersion version number of data contract
     * @param _dataAddress address of data contract
     */
    function upgradeDataAndImplementation(address _proxy, uint16 _version, address _newImplementation, uint16 _dataVersion, address _dataAddress) public onlyOwner{
        // Upgrade data before implementation to perform ownership
        // transfer for new implementation just after
        upgradeData(_dataVersion, _dataAddress);
        upgradeImplementation(_proxy, _version, _newImplementation);
    }

    /**
     * @dev Upgrade to a new data contract
     * @param _dataVersion version number of data contract
     * @param _dataAddress address of data contract
     */
    function upgradeData(uint16 _dataVersion, address _dataAddress) public onlyOwner{
        // To ensure that the owner doesn't call this method from implementation directly
        // but through Proxy contract
        require(version > 0);
        super._setDataAddress(_dataVersion, _dataAddress);
        emit UpgradedData(_dataVersion, _dataAddress);
    }

    /**
     * @dev transfers data ownership to a proxy and token implementation
     * @param _dataVersion Data version to transfer its ownership
     */
    function _transferDataOwnership(uint16 _dataVersion, address _proxy, address _implementation) internal{
        address dataAddress = super.getDataAddress(_dataVersion);
        require(dataAddress != address(0));
        require(_proxy != address(0));
        require(_implementation != address(0));
        DataOwned(dataAddress).transferDataOwnership(_proxy, _implementation);
    }
}
