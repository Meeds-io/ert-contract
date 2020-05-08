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
import "../Owned.sol";
import "./TestDataAccess.sol";

contract TestAccountFreeze is Owned, TestDataAccess{

    event FrozenAccount(address target);
    event UnFrozenAccount(address target);

    constructor() internal{
    }

    function freeze(address _target) public onlyOwner{
        if (!super.isFrozen(_target)) {
            super._setFrozenAccount(_target, true);
            emit FrozenAccount(_target);
        }
    }

    function unFreeze(address _target) public onlyOwner{
        if (super.isFrozen(_target)) {
            super._setFrozenAccount(_target, false);
            emit UnFrozenAccount(_target);
        }
    }

    function isFrozen(address _target) public view returns (bool){
        return super.isFrozen(_target);
    }

    modifier whenNotFrozen(){
        // TODO *********** Check on sender and receiver
        // ************ If this implementation will be used
        require (!super.isFrozen(msg.sender));
        _;
    }

}


