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
pragma solidity ^0.4.25 ;

/**
 * @title DataOwned.sol
 * @dev Abstract contract for Data contracts ownership testing
 */
contract DataOwned {
    // Event emitted when a new ownership has been made
    event TransferOwnership(address proxyAddress, address implementationAddress);

    // ERC20 Proxy contract address
    address public proxy;

    // ERC20 Implementation contract address
    address public implementation;

    /**
     * @dev Made internal because this contract is abstract
     */
    constructor() internal{
        // Keep contract creator as an owner until it's modified
        // When Token Proxy and Implementation contracts are deployed
        implementation = msg.sender;
    }

    /**
     * @dev Modifier that checks that the caller is either the proxy contract or
     * the the ERC20 implementation contract
     */
    modifier onlyContracts(){
        address sender = msg.sender;
        require(sender == proxy || sender == implementation);
        _;
    }

    /**
     * @dev transfers data ownership to a proxy and token implementation
     * @param _proxyAddress Proxy Contract address
     * @param _implementationAddress ERC20 Implementation Contract address
     */
    function transferDataOwnership(address _proxyAddress, address _implementationAddress) public onlyContracts{
        require (_implementationAddress != address(0));
        proxy = _proxyAddress;
        implementation = _implementationAddress;
        emit TransferOwnership(_proxyAddress, _implementationAddress);
    }
}
