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
import "../ERTTokenV1.sol";
import "./TestAccountFreeze.sol";
import "./TestDataAccess.sol";

contract TestERTTokenV2 is ERTTokenV1, TestDataAccess, TestAccountFreeze{

    constructor() ERTTokenV1() public{
    }

    function transfer(address _to, uint256 _value) public whenNotFrozen returns (bool success){
        return super.transfer(_to, _value);
    }

    function approve(address _spender, uint256 _value) public whenNotFrozen returns (bool success){
        return super.approve(_spender, _value);
    }

    function transferFrom(address _from, address _to, uint256 _value) public whenNotFrozen returns (bool success){
        return super.transferFrom(_from, _to, _value);
    }
}


