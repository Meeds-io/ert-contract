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

const decimals = Math.pow(10, 18);
const toBN = web3.utils.toBN;

contract('AccountVesting', function(accounts) {

  let tokenInstance;

  const accountVested = accounts[9];
  const accountNotApproved1 = accounts[8];
  const accountNotApproved2 = accounts[7];

  let accountTokenBalance, vestedAccountTokenBalance, accountNotApproved1Balance, accountNotApproved2Balance;

  const tokensToSend = 2 * decimals;
  const tokensToVest = 1 * decimals;

  beforeEach(async function () {
    tokenInstance = await ERTToken.deployed();
  });

  it('Test admin account sending to not approved account', () => {
    return tokenInstance.transfer(accountNotApproved1, String(tokensToSend), {
        from : accounts[0]
      }).then(assert.fail).catch((error) => {
        assert(error.message.indexOf('revert') >= 0, 'Admin level 5 shouldn\'t be able to send funds to not approved account');
      });
  });

  it('Test account vesting strategy', () => {
    // Approve account
    return tokenInstance.approveAccount(accountVested, {
      from : accounts[0]
    }).then(() => {
      // Disapprove account 1
      return tokenInstance.disapproveAccount(accountNotApproved1, {
        from : accounts[0]
      });
    }).then(() => {
      // Disapprove account 2
      return tokenInstance.disapproveAccount(accountNotApproved2, {
        from : accounts[0]
      });
    }).then(() => {
      return tokenInstance.balanceOf(accountVested);
    }).then((balance) => {
      accountTokenBalance = Number(balance);
      return tokenInstance.balanceOf(accountNotApproved1);
    }).then((balance) => {
      accountNotApproved1Balance = Number(balance);
      return tokenInstance.balanceOf(accountNotApproved2);
    }).then((balance) => {
      accountNotApproved2Balance = Number(balance);

      return tokenInstance.vestingBalanceOf(accountVested);
    }).then((balance) => {
      vestedAccountTokenBalance = Number(balance);

      // Ensure that vested balance is 0
      assert.equal(vestedAccountTokenBalance, 0, "Account shouldn't have a vesting balance yet");
      // Transfer tokens to account
      return tokenInstance.transfer(accountVested, String(tokensToSend), {
        from : accounts[0]
      });
    }).then(() => {
      return tokenInstance.vestingBalanceOf(accountVested);
    }).then((balance) => {
      vestedAccountTokenBalance = Number(balance);

      // Ensure again that vested balance is 0 after tokens are transfered
      assert.equal(vestedAccountTokenBalance, 0, "Account shouldn't have a vesting balance yet");
      return tokenInstance.balanceOf(accountVested);
    }).then((balance) => {
      assert.equal(Number(balance), accountTokenBalance + tokensToSend, "Account balance isn't coherent");

      // Transform tokens more than account balance to vested
      return tokenInstance.transformToVested(accountVested, String(Number(balance) + decimals), {
        from : accounts[0]
      });
    }).then(assert.fail).catch((error) => {
      assert(error.message.indexOf('revert') >= 0, "Shouldn't be able to transform to vested more than token balance of account");
    }).then(() => {
      // Transform tokens to account
      return tokenInstance.transformToVested(accountVested, String(tokensToVest), {
        from : accounts[0]
      });
    }).then(() => {
      return tokenInstance.vestingBalanceOf(accountVested);
    }).then((balance) => {
      assert.equal(Number(balance), tokensToVest, "Account should have a vesting balance");
      return tokenInstance.balanceOf(accountVested);
    }).then((balance) => {
      // Account balance shouldn't change after tranformed to vested
      assert.equal(Number(balance), accountTokenBalance + tokensToSend, "Account balance shouldn't be modified after transformed a part of tokens to vested");

      // Transfer vested tokens to a not approved account
      return tokenInstance.transfer(accountNotApproved1, String(tokensToVest), {
        from : accountVested
      });
    }).then(() => {
      return tokenInstance.vestingBalanceOf(accountVested);
    }).then((balance) => {
      assert.equal(Number(balance), 0, "Account should have sent all vested balance");
      return tokenInstance.vestingBalanceOf(accountNotApproved1);
    }).then((balance) => {
      assert.equal(Number(balance), tokensToVest, "'Not approved account 1' should have received all the vested balance");

      return tokenInstance.balanceOf(accountVested);
    }).then((balance) => {
      // Account balance shouldn't change after tranformed to vested
      assert.equal(Number(balance), accountTokenBalance + tokensToSend - tokensToVest, "Account balance should have been modified after transferred vested tokens");

      return tokenInstance.balanceOf(accountNotApproved1);
    }).then((balance) => {
      // Account balance shouldn't change after tranformed to vested
      assert.equal(Number(balance), accountNotApproved1Balance + tokensToVest, "'Not approved account 1' balance should be modified after receiving vested tokens");

      // Transfer vested tokens to a not approved account 2
      return tokenInstance.transfer(accountNotApproved2, String(tokensToVest), {
        from : accountNotApproved1
      });
    }).then(() => {
      return tokenInstance.vestingBalanceOf(accountNotApproved1);
    }).then((balance) => {
      assert.equal(Number(balance), 0, "'Not approved account 1' should have sent all vested balance");
      return tokenInstance.vestingBalanceOf(accountNotApproved2);
    }).then((balance) => {
      assert.equal(Number(balance), tokensToVest, "'Not approved account 2' should have received all the vested balance");

      return tokenInstance.balanceOf(accountNotApproved1);
    }).then((balance) => {
      assert.equal(Number(balance), accountNotApproved1Balance, "'Not approved account 1' balance should have been modified after transferred vested tokens");

      return tokenInstance.balanceOf(accountNotApproved2);
    }).then((balance) => {
      assert.equal(Number(balance), accountNotApproved2Balance + tokensToVest, "'Not approved account 2' balance should be modified after receiving vested tokens");
    });
  });

});
