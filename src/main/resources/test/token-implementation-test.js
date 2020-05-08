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
const ERTTokenV1 = artifacts.require("ERTTokenV1");

contract('Token Implementation', function(accounts) {
    let tokenV1Instance;

    it('initialized token storage', () => {
      return ERTTokenV1.deployed()
        .then(instance => {
          tokenV1Instance = instance;
          return tokenV1Instance.name();
        }).then(assert.fail).catch(error => {
          assert.isTrue(String(error).indexOf("revert") >= 0 , `Shouldn't be able to access data contract from implementation`); 
          return tokenV1Instance.symbol();
        }).then(assert.fail).catch(error => {
          assert.isTrue(String(error).indexOf("revert") >= 0 , `Shouldn't be able to access data contract from implementation`); 
          return tokenV1Instance.isPaused();
        }).then(paused => {
          assert.isTrue(paused, `Implementation token should be paused`); 
          return tokenV1Instance.owner.call();
        }).then(owner => {
          assert.equal(owner, accounts[0], `Implementation token owner should be accounts[0]`); 
          return tokenV1Instance.getDataAddress(1);
        }).then(dataAddress => {
          assert.equal(dataAddress, '0x0000000000000000000000000000000000000000', `Implementation token shouldn't hold a reference to data contract`); 
        });
    })
});
