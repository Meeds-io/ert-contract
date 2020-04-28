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
import "./SafeMath.sol";
import "./DataAccess.sol";

/**
 * @title ERC20Abstract.sol
 * @dev An abstract contract to define internally a common operation
 * with a common logic for transfer operation
 */
contract ERC20Abstract is DataAccess, SafeMath {

    // Event emited when a token transfer happens is made
    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    // Event emited when a token transfer Approval is made
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

    /**
     * @dev Made internal because this contract is abstract
     */
    constructor() internal{
    }

    /**
     * @dev Transfers an amount of ERC20 tokens from an address to another.
     * @param _from address of sender
     * @param _to address of receiver
     * @param _value amount of tokens to transfer
     * @return true if the transfer completed successfully
     */
    function _transfer(address _from, address _to, uint _value) internal returns (bool){
        // Prevent transfer transaction with no tokens
        require(_value > 0);
        // Prevent transfer to 0x address. Use burn() instead
        require(_to != address(0));
        // Check if the sender has enough
        uint256 fromBalance = super._balanceOf(_from);
        require(fromBalance >= _value);
        // Subtract from the sender
        super._setBalance(_from, super.safeSubtract(fromBalance, _value));
        // Add the same to the recipient
        super._setBalance(_to, super.safeAdd(super._balanceOf(_to), _value));
        return true;
    }
}
