const ERTToken = artifacts.require("ERTToken");
  
contract('ApprouvableAccount', function(accounts) {
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

  it ('test approveAccount', () => {
    return tokenInstance.approveAccount(accounts[4],  {
      from : accounts[1]
    }).then(assert.fail).catch(error => {
      assert(error.message.indexOf('revert') >= 0, 'accounts[4] is not an admin with habilitation level 1, thus he must be unable to approve accounts');  
      return tokenInstance.approveAccount(accounts[7]);
    }).then(receipt => {
      assert.isDefined(receipt.logs, 'ApprovedAccount event is expected');
      const approvedAccountLog = receipt.logs.find(log => log.event === 'ApprovedAccount');
      assert.isDefined(approvedAccountLog, 'ApprovedAccount event is expected');
      assert.isDefined(approvedAccountLog.args, 'ApprovedAccount event should have arguments');
      assert.equal(approvedAccountLog.args.target, accounts[7], 'ApprovedAccount event should have "target" argument that equals to accounts[7]');
      return tokenInstance.isApprovedAccount(accounts[7]);
    }).then(approved => {
      assert.isTrue(approved, 'accounts[7] must be approved');
    })
  })

  it ('test disapproveAccount', () => {
    return ERTToken.deployed().then(function(instance){
      tokenInstance = instance;
      return tokenInstance.disapproveAccount(accounts[0]);
    }).then(assert.fail).catch(error => {
      assert(error.message.indexOf('revert') >= 0, `Shouldn't be able to disapprove owner account`);  
      return tokenInstance.approveAccount(accounts[7]);
    }).then(receipt => {
      return tokenInstance.disapproveAccount(accounts[7]);
    }).then(receipt => {
      assert.isDefined(receipt.logs, 'DisapprovedAccount event is expected');
      const disapprovedAccountLog = receipt.logs.find(log => log.event === 'DisapprovedAccount');
      assert.isDefined(disapprovedAccountLog, 'DisapprovedAccount event is expected');
      assert.isDefined(disapprovedAccountLog.args, 'DisapprovedAccount event should have arguments');
      assert.equal(disapprovedAccountLog.args.target, accounts[7], 'DisapprovedAccount event should have "target" argument that equals to accounts[7]');
      return tokenInstance.isApprovedAccount(accounts[7]);
    }).then(approved => {
      assert.equal(approved, false, 'Account is not approved');
    }) 
  })

  it ('test approveAccount by admin level 1 when the onlyAdmin(4) ' , function(){
    return tokenInstance.addAdmin(accounts[1], 4).then(receipt => {
      return tokenInstance.approveAccount(accounts[7], {from : accounts[1]});
    }).then(receipt => {
      return tokenInstance.isApprovedAccount(accounts[7]);
    }).then(approved => {
      assert.equal(approved, true, 'Account is not approved by admin with level 1');
    }) 
  })
});



