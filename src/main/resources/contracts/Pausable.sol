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

import './TokenStorage.sol';
import "./Admin.sol";
import "./DataAccess.sol";

/**
 * @title Pausable.sol
 * @dev Abstract contract to determine whether the contract is paused or not
 */
contract Pausable is TokenStorage, DataAccess, Admin {

    // Event emitted when the contract is paused
    event ContractPaused();
    // Event emitted when the contract is un-paused
    event ContractUnPaused();

    /**
     * @dev Made internal because this contract is abstract
     */
    constructor() internal{
    }

    /**
     * @dev a modifier to check if the contract is paused
     */
    modifier whenNotPaused(){
        require (!isPaused());
        _;
    }

    /**
     * @dev Check if ERC20 operations are frozen for all accounts or not
     * @return true if ERC20 operations are paused
     */
    function isPaused() public view returns (bool){
        return paused || super._isPaused();
    }

    /**
     * @dev pause the contract and store it inside the data contract
     * to avoid calling ERC20 methods directly using the implementation
     * contract
     */
    function pause() public onlyAdmin(5){
        super._setPaused(true);
        paused = true;
        emit ContractPaused();
    }

    /**
     * @dev unpause the contract
     */
    function unPause() public onlyAdmin(5){
        super._setPaused(false);
        paused = false;
        emit ContractUnPaused();
    }
}
