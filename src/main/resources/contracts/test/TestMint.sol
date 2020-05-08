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
import "../ERC20Abstract.sol";
import "../Owned.sol";

contract TestMint is Owned,  ERC20Abstract{

    event MintedToken(address minter, address target, uint256 mintedAmount);

    constructor() internal{
    }

    function mintToken(address _target, uint256 _mintedAmount) public onlyOwner{
        require(_mintedAmount > 0);
        super._setBalance(_target, super.safeAdd(super._balanceOf(_target), _mintedAmount));
        uint256 totalSupply = super.totalSupply();
        require(totalSupply + _mintedAmount > totalSupply);
        super._setTotalSupply(totalSupply + _mintedAmount);
        emit Transfer(address(0), owner, _mintedAmount);
        emit Transfer(owner, _target, _mintedAmount);
        emit MintedToken(msg.sender, _target, _mintedAmount);
    }
}
