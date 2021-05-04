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
var ERTToken = artifacts.require("./ERTToken.sol");

var ERTTokenV1 = artifacts.require("./ERTTokenV1.sol");
var ERTTokenV2 = artifacts.require("./ERTTokenV2.sol");

var ERTTokenDataV1 = artifacts.require("./ERTTokenDataV1.sol");
var ERTTokenDataV2 = artifacts.require("./ERTTokenDataV2.sol");

module.exports =  function(deployer, network, accounts) {

  return deployer.deploy(ERTTokenV2)
    //deployment of ERTTokenDataV2
    .then(() => deployer.deploy(ERTTokenDataV2, "0x6ebea3853f9ccfee96af139a5dfae801bae691ea", ERTTokenV2.address))
    .then(() => ERTTokenV2.deployed())
    .then(() => ERTTokenDataV2.deployed())
    .then(() => ERTToken.at("0x6ebea3853f9ccfee96af139a5dfae801bae691ea"))
    // Upgrade current contract to new versions
    .then((ertTokenInstance) => ertTokenInstance.upgradeDataAndImplementation("0x6ebea3853f9ccfee96af139a5dfae801bae691ea", 2, ERTTokenV2.address, 2, ERTTokenDataV2.address));
};