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
const ERTToken = artifacts.require("ERTToken");
const ERTTokenV2 = artifacts.require("ERTTokenV2");
  
contract('TokenStorage', function(accounts) {
    let tokenInstance;

    it('initialized token storage', () => {
      return ERTToken.deployed().then(instance => {
        tokenInstance = instance;
          return tokenInstance.implementationAddress.call();
        }).then(function(implementation) {
          assert.equal(implementation, ERTTokenV2.address, 'should return the current implementation');    
          return tokenInstance.owner.call();
        }).then(function(owner) {
          assert.equal(owner, accounts[0], 'should return the owner address of the contract');  
          return tokenInstance.version.call();
        }).then(function(version) {
          assert.equal(version, 2 , 'should return the version of the iplementation'); 
        });
    })

});

  
  
