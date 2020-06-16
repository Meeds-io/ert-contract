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
