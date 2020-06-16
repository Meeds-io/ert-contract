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

import "../Owned.sol";
import "../DataAccess.sol";
import "../SafeMath.sol";


contract TestBurn is Owned, DataAccess, SafeMath{

    event Burn(address burner, uint256 value);

    constructor() internal{
    }

    function burn(uint256 _value) public onlyOwner{
        uint256 ownerBalance = super._balanceOf(msg.sender);
        require(ownerBalance >= _value);
        super._setBalance(msg.sender, super.safeSubtract(ownerBalance, _value));
        super._setTotalSupply(super.safeSubtract(super.totalSupply(), _value));
        emit Burn(msg.sender, _value);
    }

}
