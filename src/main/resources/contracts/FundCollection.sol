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
import "./Admin.sol";

/**
 * @title FundCollection.sol
 * @dev Used to receive ether from owner only to pay gas
 */
contract FundCollection is Admin {

    // Event emitted when the owner deposits ether on contract
    event DepositReceived(address from, uint amount);

    /**
     * @dev Made internal because this contract is abstract
     */
    constructor() internal{
    }

    /**
     * @dev receive funds from owner to pay necessary gas for ERC20 methods
     * (see GasPayableInToken.sol)
     */
    function() external payable onlyAdmin(5) {
        require(msg.data.length == 0);
        require(msg.value > 0);
        emit DepositReceived(msg.sender, msg.value);
    }
}
