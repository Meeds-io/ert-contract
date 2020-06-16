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

contract('Proxy', function(accounts) {

  let tokenInstance;
  let initialProxyBalance;

  const fiveWei = web3.utils.toWei("5", 'ether').toString();

  it('Send ether to Proxy', () => {
    return ERTToken.deployed()
      .then(instance => {
        tokenInstance = instance;
        return web3.eth.getBalance(ERTToken.address)
      })
      .then(result => {
        initialProxyBalance = Number(result.toString());
        return web3.eth.sendTransaction({
          from : accounts[0],
          to: ERTToken.address,
          value : fiveWei
        });
      })
      .then(result => web3.eth.getBalance(ERTToken.address))
      .then(result => 
        assert.equal(Number(String(result)), initialProxyBalance + Number(fiveWei), 'the balance of ERTToken is wrong ')
      );
  });

});