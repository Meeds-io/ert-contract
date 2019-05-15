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
