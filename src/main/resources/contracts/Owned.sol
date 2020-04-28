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
