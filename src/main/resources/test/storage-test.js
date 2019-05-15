const ERTToken = artifacts.require("ERTToken");
const ERTTokenV2 = artifacts.require("ERTTokenV2");
  
contract('TokenStorage', function(accounts) {
    let tokenInstance;

    it('initialized token storage', () => {
      return ERTToken.deployed().then(instance => {
        tokenInstance = instance;
          return tokenInstance.implementationAddress.call();
        }).then(function(implementation) {
          assert.equal(implementation, ERTTokenV2.address, 'should return the current implementation');    
          return tokenInstance.owner.call();
        }).then(function(owner) {
          assert.equal(owner, accounts[0], 'should return the owner address of the contract');  
          return tokenInstance.version.call();
        }).then(function(version) {
          assert.equal(version, 2 , 'should return the version of the iplementation'); 
        });
    })

});

  
  
