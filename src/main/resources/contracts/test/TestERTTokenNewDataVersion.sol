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

import "../DataOwned.sol";

contract TestERTTokenNewDataVersion is DataOwned {

    mapping (address => bool) internal frozenAccount_;

    constructor(address _proxyAddress, address _implementationAdress) public{
        proxy = _proxyAddress;
        implementation = _implementationAdress;
    }

    function isFrozen(address _target) public view returns(bool){
        return frozenAccount_[_target];
    }

    function setFrozenAccount(address _target, bool _frozen) public onlyContracts{
        frozenAccount_[_target] = _frozen;
    }

}
