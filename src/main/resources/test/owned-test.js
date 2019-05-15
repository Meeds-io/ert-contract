const ERTToken = artifacts.require("ERTToken");
const ERTTokenV1 = artifacts.require("ERTTokenV1");
const ERTTokenV2 = artifacts.require("ERTTokenV2");

contract('Owned', function(accounts) {
  
  let tokenInstance;
  let tokenV1Instance;
  let tokenV2Instance;

  async function setTokenInstance() {
    tokenInstance = await ERTToken.deployed();
    tokenV1Instance = await ERTTokenV1.deployed();
    tokenV2Instance = await ERTTokenV2.deployed();
  }

  beforeEach(async function () {
    await setTokenInstance();
  });

  it('Test owner address on contracts', function() {
    return tokenInstance.owner.call()
      .then(owner => {
        assert.equal(owner, accounts[0], 'Wrong owner on Token Proxy contract');
        return tokenV1Instance.owner.call();
      }).then(owner => {
        assert.equal(owner, accounts[0], 'Wrong owner on Token Implementation V1 contract');
        return tokenV2Instance.owner.call();
      }).then(owner => {
        assert.equal(owner, accounts[0], 'Wrong owner on Token Implementation V2 contract');
      });
  })

  it('transfer token contract ownership', function() {
    return tokenInstance.transferOwnership(accounts[2], {from : accounts[1]})
      .then(assert.fail).catch(function(error) {
        assert(error.message.indexOf('revert') >= 0, 'Only contract owner can invoke transferOwnership on contracts');
        return tokenInstance.transferOwnership(accounts[2], {from : accounts[0]});
      }).then(receipt => {
        const transferOwnershipLog = receipt.logs.find(log => log.event === 'TransferOwnership');
        assert.isDefined(transferOwnershipLog, 'TransferOwnership event is expected');
        assert.isDefined(transferOwnershipLog.args, 'TransferOwnership event should have arguments');
        assert.equal(transferOwnershipLog.args.newOwner, accounts[2], 'Transfer event should have "_from" argument that equals to accounts[2]');
        return tokenInstance.transferOwnership(accounts[0], {from : accounts[2]});
      }).then(receipt => {
        const transferOwnershipLog = receipt.logs.find(log => log.event === 'TransferOwnership');
        assert.isDefined(transferOwnershipLog, 'TransferOwnership event is expected');
        assert.isDefined(transferOwnershipLog.args, 'TransferOwnership event should have arguments');
        assert.equal(transferOwnershipLog.args.newOwner, accounts[0], 'Transfer event should have "_from" argument that equals to accounts[0]');
      });
  })
});










