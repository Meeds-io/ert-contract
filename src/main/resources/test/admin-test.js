const ERTToken = artifacts.require("ERTToken");


contract('Admin', function(accounts) {
  let tokenInstance;

  async function setInitialAdmin(accounts) {
    tokenInstance = await ERTToken.deployed();
    for (account in accounts) {
      await tokenInstance.removeAdmin(account);
    }
  }

  beforeEach(async function () {
    await setInitialAdmin();
  });

  afterEach(async function () {
    await setInitialAdmin();
  });

  it('test addAdmin and getAdminLevel' , function(){
    return tokenInstance.addAdmin(accounts[6], 7 , {
          from : accounts[1]
      }).then(assert.fail).catch(function(error) {
        assert(error.message.indexOf('revert') >= 0, 'The authorized habilitation level is <= 0 or >= 6');  
        return tokenInstance.addAdmin(accounts[6], 1 , {
          from : accounts[1]});
      }).then(assert.fail).catch(function(error) {
        assert(error.message.indexOf('revert') >= 0, 'The sender is not an admin with level 5, thus this should fails');  
        return tokenInstance.addAdmin(accounts[0], 1 , {
          from : accounts[0]});
      }).then(assert.fail).catch(function(error) {
        assert(error.message.indexOf('revert') >= 0, `The owner is already an admin with highest level, thus he shouldn't be able to add himself as admin`);  
        return tokenInstance.addAdmin(accounts[5], 5, {
            from : accounts[0]
        });
      }).then(receipt => {
        assert.isDefined(receipt.logs, 'AddedAdmin event is expected');
        const addedAdminLog = receipt.logs.find(log => log.event === 'AddedAdmin');
        assert.isDefined(addedAdminLog, 'AddedAdmin event is expected');
        assert.isDefined(addedAdminLog.args, 'AddedAdmin event should have arguments');
        assert.equal(addedAdminLog.args.target, accounts[5], 'AddedAdmin event should have "target" argument that equals to accounts[5]');
        assert.equal(addedAdminLog.args.level, 5, 'AddedAdmin event should have "level" argument that equals to 5');
        return tokenInstance.isAdmin(accounts[5], 5);
      }).then(admin => {
        assert.equal(admin, true, 'accounts[5] should be admin with level 5');
        return tokenInstance.getAdminLevel(accounts[5]);
      }).then(level => {
        assert.equal(level, 5, 'accounts[5] should be admin with level 5');
        return tokenInstance.getAdminLevel(accounts[4]);
      }).then(level => {
        assert.equal(level, 0, `accounts[4] shouldn't be admin`);
        return tokenInstance.addAdmin(accounts[4], 1, {
          from : accounts[5]
        });
      }).then(() => {
        return tokenInstance.getAdminLevel(accounts[4]);
      }).then(level => {
        assert.equal(level, 1, `accounts[4] should be admin with level 1`);
      });
  })

  it ('test removeAdmin' , function(){
    return tokenInstance.addAdmin(accounts[4], 1).then(() => {
        return tokenInstance.addAdmin(accounts[5], 5);
      }).then(() => {
        return tokenInstance.removeAdmin(accounts[0], {from: accounts[5]});
      }).then(receipt => {
        assert.equal(receipt && receipt.receipt && receipt.receipt.status, true, 'Should be able to remove owner as admin');
        return tokenInstance.removeAdmin(accounts[5], {from: accounts[5]});
      }).then(assert.fail).catch(function(error) {
        assert(error.message.indexOf('revert') >= 0, `An admin shound't be able to delete himself`);  
        return tokenInstance.removeAdmin(accounts[4], {from: accounts[5]});
      }).then(receipt => {
        assert.isDefined(receipt.logs, 'RemovedAdmin event is expected');
        const removedAdminLog = receipt.logs.find(log => log.event === 'RemovedAdmin');
        assert.isDefined(removedAdminLog, 'RemovedAdmin event is expected');
        assert.isDefined(removedAdminLog.args, 'RemovedAdmin event should have arguments');
        assert.equal(removedAdminLog.args.target, accounts[4], 'RemovedAdmin event should have "target" argument that equals to accounts[4]');
        return tokenInstance.isAdmin(accounts[4], 1);
      }).then(notAdmin => {
        assert.equal(notAdmin, false, 'Removed accounts[4] habilitation is still admin');
        return tokenInstance.removeAdmin(accounts[5]);
      }).then(receipt => {
        assert.isDefined(receipt.logs, 'RemovedAdmin event is expected');
        const removedAdminLog = receipt.logs.find(log => log.event === 'RemovedAdmin');
        assert.isDefined(removedAdminLog, 'RemovedAdmin event is expected');
        assert.isDefined(removedAdminLog.args, 'RemovedAdmin event should have arguments');
        assert.equal(removedAdminLog.args.target, accounts[5], 'RemovedAdmin event should have "target" argument that equals to accounts[5]');
        return tokenInstance.isAdmin(accounts[5], 1);
      }).then(notAdmin => {
        assert.equal(notAdmin, false, 'Removed accounts[5] habilitation is still admin');
      });
  })

  it ('addAdmin two times without removing the first time, should use the last level' , function(){
    return tokenInstance.addAdmin(accounts[6], 5, {from : accounts[0]}).then(receipt => {
        return tokenInstance.getAdminLevel(accounts[6]);
      }).then(level => {
        assert.equal(level, 5, `Account shouldn't be not admin`);
        return tokenInstance.addAdmin(accounts[6], 2, {from : accounts[0]});
      }).then(receipt => {
        return tokenInstance.getAdminLevel(accounts[6]);
      }).then(level => {
        assert.equal(level, 2, 'level of accounts[6] is wrong : should be the last level added');
      });
  })

  it (`Admin with level 4 can't add admin` , function(){
    return tokenInstance.addAdmin(accounts[7], 4, {from : accounts[0]}).then(receipt => {
        return tokenInstance.addAdmin(accounts[3], 1, {from : accounts[7]});
      }).then(assert.fail).catch(function(error) {
        assert(error.message.indexOf('revert') >= 0, 'when the level does not allow to add admin');  
      });
  })
});
