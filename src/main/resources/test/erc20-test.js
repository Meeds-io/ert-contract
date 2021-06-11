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
const ERTTokenV1 = artifacts.require("ERTTokenV1");

const decimals = Math.pow(10, 18);
const toBN = web3.utils.toBN;

contract('ERC20', function(accounts) {

  let tokenInstance;

  async function setInitialApprovedAccounts(accounts) {
    tokenInstance = await ERTToken.deployed();
    for (account in accounts) {
      await tokenInstance.removeAdmin(account);
      await tokenInstance.disapproveAccount(account);
    }
  }

  beforeEach(async function () {
    await setInitialApprovedAccounts();
  });

  afterEach(async function () {
    await setInitialApprovedAccounts();
  });

  it('put 100000 * 10 ^ 18 ERTToken in the admin account', function() {
    return tokenInstance.balanceOf(accounts[0])
      .then(adminBalance => {
        assert.equal(adminBalance.toString(), toBN(100000).mul(toBN(decimals)).toString(), "100000 * 10 ^ 18 wasn't in the admin account");
      });
  });

  it('transfer tokens', function() {
    return tokenInstance.transfer(accounts[1], toBN(100001).mul(toBN(decimals)).toString(), {from : accounts[0]})
      .then(assert.fail).catch(function(error) {
        assert(error.message.indexOf('revert') >= 0, 'No transfer with exceeded tokens is allowed');
        // Test error require msg.sender != _to
        return tokenInstance.transfer(accounts[0], toBN(99).mul(toBN(decimals)).toString(), {from : accounts[0]});
      }).then(assert.fail).catch(function(error) {
        assert(error.message.indexOf('revert') >= 0, 'No self transfer is allowed');
        // Test error require value > 0
        return tokenInstance.transfer(accounts[5], toBN(-5).mul(toBN(decimals)).toString());
      }).then(assert.fail).catch(function(error) {
        assert(error.message.indexOf('value out-of-bounds') >= 0, 'No negative tokens transfer should be allowed');
        // Test error require to != 0x0
        return tokenInstance.transfer("0x0000000000000000000000000000000000000000", toBN(7).mul(toBN(decimals)).toString(), {from : accounts[0]});
      }).then(assert.fail).catch(function(error) {
        assert(error.message.indexOf('No transfer to 0x address is allowed') >= 0, 'No transfer to 0x address is allowed');
        return tokenInstance.transfer(ERTTokenV1.address, toBN(7).mul(toBN(decimals)).toString(), {from : accounts[0]});
      }).then(assert.fail).catch(function(error) {
        assert(error.message.indexOf('No transfer to 0x address is allowed') >= 0, 'No transfer to a contract address is allowed');
        return tokenInstance.balanceOf(accounts[0]);
      }).then(balance => {
        assert.equal(balance.toString(), toBN(100000).mul(toBN(decimals)).toString(), 'Wrong balance of contract owner');
        return tokenInstance.approveAccount(accounts[1], {
          from : accounts[0]
        });
      }).then(receipt => {
        return tokenInstance.transfer(accounts[1], toBN(6).mul(toBN(decimals)).toString(), {
          from : accounts[0]
        });
      }).then(receipt => {
        assert.isDefined(receipt.logs, 'Transfer event is expected');

        const transferLog = receipt.logs.find(log => log.event === 'Transfer');
        assert.isDefined(transferLog, 'Transfer event is expected');
        assert.isDefined(transferLog.args, 'Transfer event should have arguments');
        assert.equal(transferLog.args._from, accounts[0], 'Transfer event should have "_from" argument that equals to accounts[0]');
        assert.equal(transferLog.args._to, accounts[1], 'Transfer event should have "_to" argument that equals to accounts[1]');
        assert.equal(transferLog.args._value, toBN(6).mul(toBN(decimals)).toString(), 'Transfer event should have "_value" argument that equals to 6 tokens');
        return tokenInstance.transfer(accounts[1], toBN(10).mul(toBN(decimals)).toString(), {
          from : accounts[0]
        });
      }).then(receipt => {
        const approvedAccountLog = receipt.logs.find(log => log.event === 'ApprovedAccount');
        assert.isUndefined(approvedAccountLog, `ApprovedAccount event shouldn't be emitted`);

        const transferLog = receipt.logs.find(log => log.event === 'Transfer');
        assert.isDefined(transferLog, 'Transfer event is expected');
        assert.isDefined(transferLog.args, 'Transfer event should have arguments');
        assert.equal(transferLog.args._from, accounts[0], 'Transfer event should have "_from" argument that equals to accounts[0]');
        assert.equal(transferLog.args._to, accounts[1], 'Transfer event should have "_to" argument that equals to accounts[1]');
        assert.equal(transferLog.args._value, toBN(10).mul(toBN(decimals)).toString(), 'Transfer event should have "_value" argument that equals to 6 tokens');
        return tokenInstance.balanceOf(accounts[1]);
      }).then(balance => {
        assert.equal(balance.toString(), toBN(16).mul(toBN(decimals)).toString(),
            'token balance of receiver is wrong');
        return tokenInstance.balanceOf(accounts[0]);
      }).then(balance => {
        assert.equal(balance.toString(), toBN(100000 - 16).mul(toBN(decimals)).toString(),
            'token balance of sender is wrong');
      });
  });

  it('approves tokens for delegated transfer', function() {
    return tokenInstance.approveAccount(accounts[1], {
        from : accounts[0]
      })
      .then(receipt => {
        return tokenInstance.approve(accounts[1], toBN(11111111111111).mul(toBN(decimals)).toString(), {
          from : accounts[0]
        });
      })
      .then(assert.fail).catch(function(error) {
        assert(error.message.indexOf('revert') >= 0, `token holder shouldn't be able to approve an amount that is greater than his balance`);
        // Test require msg.sender != _spender
        return tokenInstance.approve(accounts[0], toBN(11).mul(toBN(decimals)).toString(), {
          from : accounts[0]
        });
      }).then(assert.fail).catch(function(error) {
        assert(error.message.indexOf('revert') >= 0, `token holder shouldn't be able to approve tokens sending for himself`);
        return tokenInstance.approve.call(accounts[1], toBN(5).mul(toBN(decimals)).toString());
      }).then(success => {
        assert.equal(success, true, 'ERC20 approve transaction failed');
      }).then(() => {
        return tokenInstance.approveAccount(accounts[2], {
          from : accounts[0]
        });
      }).then(() => {
        return tokenInstance.approve(accounts[2], toBN(5).mul(toBN(decimals)).toString());
      }).then(receipt => {
        const approveLog = receipt.logs.find(log => log.event === 'Approval');
        assert.isDefined(approveLog, 'Approval event is expected');
        assert.isDefined(approveLog.args, 'Approval event should have arguments');
        assert.equal(approveLog.args._owner, accounts[0], 'Approval event should have "_from" argument that equals to accounts[0]');
        assert.equal(approveLog.args._spender, accounts[2], 'Approval event should have "_to" argument that equals to accounts[1]');
        assert.equal(approveLog.args._value, toBN(5).mul(toBN(decimals)).toString(), 'Approval event should have "_value" argument that equals to 6 tokens');
        return tokenInstance.allowance(accounts[0], accounts[2]);
      }).then(allowed => {
        assert.equal(allowed.toString(), toBN(5).mul(toBN(decimals)).toString(),
          'stores the allowance for delegated trasnfer');
      });
  });

  let fromAccount = accounts[3], toAccount = accounts[4], spendingAccount = accounts[5];
  let cannotTransferAgain = false;
  it('handles delegated token transfers', function() {
    return tokenInstance.approveAccount(accounts[3], {
        from : accounts[0]
      })
      .then(receipt => {
        return tokenInstance.approveAccount(accounts[4], {
          from : accounts[0]
        });
      })
      .then(receipt => {
        return tokenInstance.approveAccount(accounts[5], {
          from : accounts[0]
        });
      })
      .then(receipt => {
        return tokenInstance.transfer(fromAccount, toBN(100).mul(toBN(decimals)).toString());
      })
      .then(receipt => {
        // Reciever address should be approved first to be able to receive Tokens
        return tokenInstance.approveAccount(spendingAccount, {
          from : accounts[0]
        });
      }).then(receipt => {
        // We have to approve 'toAccount' first before sending him some tokens
        return tokenInstance.approveAccount(toAccount, {
          from : accounts[0]
        });
      }).then(receipt => {
        return tokenInstance.approve(spendingAccount, toBN(10).mul(toBN(decimals)).toString(), {
          from : fromAccount
        });
      }).then(receipt => {
        return tokenInstance.transferFrom(fromAccount, toAccount, toBN(10).mul(toBN(decimals)).toString(), {
          from : spendingAccount
        });
      }).then(receipt => {
        return tokenInstance.transferFrom(fromAccount, toAccount, toBN(1).mul(toBN(decimals)).toString(), {
          from : spendingAccount
        });
      }).catch(error => {
        cannotTransferAgain = true;
      }).then(receipt => {
        assert.equal(true, cannotTransferAgain, "Shouldn't be able to transfer again");
        return tokenInstance.balanceOf(fromAccount);
      }).then(balance => {
        assert.equal(balance.toString(), toBN(90).mul(toBN(decimals)).toString(),
          'Balance of sending account is wrong');
        return tokenInstance.balanceOf(spendingAccount);
      }).then(balance => {
        assert.equal(balance.toNumber(), 0,
          'Balance of spending account is wrong');
        return tokenInstance.balanceOf(toAccount);
      }).then(balance => {
        assert.equal(balance.toString(), toBN(10).mul(toBN(decimals)).toString(),
          'Balance of receiver account is wrong');
        return tokenInstance.allowance(fromAccount, spendingAccount);
      }).then(allowance => {
        assert.equal(allowance.toNumber(), 0,
          'Allowance amount is wrong');
      });
  });
});
