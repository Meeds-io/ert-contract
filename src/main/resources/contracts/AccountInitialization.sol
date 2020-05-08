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
import "./ERTTokenV1.sol";

/**
 * @title AccountInitialization.sol
 * @dev account initialization to prepare it to use Tokens
 */
contract AccountInitialization is ERTTokenV1 {

    // Event emited when an address is initialized
    event Initialization(address indexed _from, address indexed _to, uint256 _tokenAmount, uint256 _etherAmount);

    constructor () internal {
    }

    /**
     * @dev `msg.sender` initializes `_to` account with token and ether initial amounts
     * The ether is sent using msg.value and the tokens are sent from msg.sender balance
     * @param _to The address of the account to initialize
     * @param _tokenAmount The amount of tokens to be transfered for account to init
     */
    function initializeAccount(address _to, uint256 _tokenAmount) public payable onlyAdmin(2) whenNotPaused {
        // Shouldn't initialize a contract address
        require(!super._isContract(_to));

        // Test if the account has already been initialized
        require(!super.isInitializedAccount(_to));

        // Mark address as initialized
        super._setInitializedAccount(_to);
        // Emit a specific event for initialization operation
        emit Initialization(msg.sender, _to, _tokenAmount, msg.value);

        // Transfer intial ether amount
        if (msg.value > 0) {
            _to.transfer(msg.value);
        }

        // Approve account to initialize
        super._approveAccount(_to);

        // Transfer intial token amount
        if (_tokenAmount > 0) {
          require(super._transfer(msg.sender, _to, _tokenAmount) == true);

          // Emit Standard ERC-20 event
          emit Transfer(msg.sender, _to, _tokenAmount);
        }
    }

}
