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

contract('FundCollection', function(accounts) {
  it('Send ether to contract', function() {
    return ERTToken.deployed().then(function(instance) {
      tokenInstance = instance;
    }).then(() => {
      return web3.eth.getBalance(tokenInstance.address);
    }).then(balance => {
      assert.equal(balance, 0, 'Contract balance should be empty');
    }).then(() => {
      return web3.eth.sendTransaction({
        from : accounts[0],
        to: tokenInstance.address,
        value : web3.utils.toWei("1","ether")
      });
    }).then(() => {
      return web3.eth.getBalance(tokenInstance.address);
    }).then(balance => {
      assert.equal(String(balance), String(web3.utils.toWei("1","ether")), 'Contract balance should be 1 ether');
    });
  });
});
