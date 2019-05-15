const ERTToken = artifacts.require("ERTToken");

const ERTTokenV2 = artifacts.require("ERTTokenV2");

const ERTTokenDataV1 = artifacts.require("ERTTokenDataV1");
const ERTTokenDataV2 = artifacts.require("ERTTokenDataV2");
const TestERTTokenNewDataVersion = artifacts.require("TestERTTokenNewDataVersion");

const TestTokenNewVersion = artifacts.require("TestTokenNewVersion");
const TestTokenNewerVersion = artifacts.require("TestTokenNewerVersion");

const decimals = Math.pow(10, 18);

const testDataVersion = 3;

const testTokenImplV1 = 3;
const testTokenImplV2 = 4;

contract('Upgradability', function(accounts) {

  let tokenInstance;
  let tokenDataV1Instance;
  let tokenDataV2Instance;
  let testDataVersionInstance;

  it('Test ownership of Test impl contract', function() {
   return TestTokenNewVersion.deployed()
     .then(instance => {
       tokenInstance = instance;
       return tokenInstance.owner.call();
     }).then(function(result) {
       assert.equal(result, accounts[0] , 'the owner of TestTokenNewVersion is wrong'); 
     });
  })

  it('Test ownership of Test Data contract', function() {
    return TestERTTokenNewDataVersion.deployed()
      .then(instance => {
        tokenInstance = instance;
        return tokenInstance.implementation.call();
      }).then(function(result) {
        assert.equal(result, TestTokenNewVersion.address , 'the implementation of TestERTTokenNewDataVersion is wrong'); 
        return tokenInstance.proxy.call();
      }).then(function(result) {
        assert.equal(result, ERTToken.address , 'the proxy of TestERTTokenNewDataVersion is wrong'); 
      });
  })

  it('Test ownership of newer Test impl contract', function() {
    return TestTokenNewerVersion.deployed()
      .then(instance => {
        tokenInstance = instance;
        return tokenInstance.owner.call();
      }).then(function(result) {
        assert.equal(result, accounts[0] , 'the owner of TestTokenNewerVersion is wrong'); 
      });
  })

  const fiveEtherInWei = web3.toWei("5", 'ether').toString();

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
          value : fiveEtherInWei
        });
      })
      .then(result => web3.eth.getBalance(ERTToken.address))
      .then(result => 
        assert.equal(Number(String(result)), initialProxyBalance + Number(fiveEtherInWei), 'the balance of ERTToken is wrong ')
      );
  });

  it('Upgrade implementation to new test version and add test data version contract', () => {
    return ERTToken.deployed()
      .then(instance => {
        tokenInstance = instance;
        return tokenInstance.upgradeImplementation(ERTToken.address, 2, TestTokenNewVersion.address);
      }).then(assert.fail).catch(function(error) {
        assert(error.message.indexOf('revert') >= 0, "Version 1 address shouldn't be accepted. It should be greater than previous one to be accepted");
        return tokenInstance.upgradeImplementation(ERTToken.address, 3, ERTTokenV2.address);
      }).then(assert.fail).catch(function(error) {
        assert(error.message.indexOf('revert') >= 0, "New implementation should be different from old one");
        return tokenInstance.upgradeImplementation(ERTToken.address, 3, TestTokenNewVersion.address, {
          from: accounts[5]
        });
      }).then(assert.fail).catch(function(error) {
        assert(error.message.indexOf('revert') >= 0, "Only owner should be able to upgrade implementation");
        return tokenInstance.implementationAddress.call();
      }).then(function(implementation) {
        assert.equal(implementation, ERTTokenV2.address, 'Current V2 implementation seems to be wrong');
        return tokenInstance.upgradeDataAndImplementation(ERTToken.address, testTokenImplV1, TestTokenNewVersion.address, testDataVersion, TestERTTokenNewDataVersion.address);
      }).then(function(receipt) {
        const upgradedEvent = receipt.logs.find(log => log && log.event && log.event === 'Upgraded');
        assert.isDefined(upgradedEvent ,'Upgraded event should be emitted');
        assert.equal(upgradedEvent.args.implementationVersion, testTokenImplV1, 'the implementation version is wrong');
        assert.equal(upgradedEvent.args.implementationAddress, TestTokenNewVersion.address,'the implementation address is wrong');

        const upgradedDataEvent = receipt.logs.find(log => log && log.event && log.event === 'UpgradedData');
        assert.isDefined(upgradedDataEvent ,'UpgradedData event should be emitted');
        assert.equal(upgradedDataEvent.args.dataVersion, testDataVersion, 'the data version is wrong in event');
        assert.equal(upgradedDataEvent.args.dataAddress, TestERTTokenNewDataVersion.address,'the data V2 address is wrong in event');
        return tokenInstance.implementationAddress.call();
      }).then(function(implementation) {
        assert.equal(implementation, TestTokenNewVersion.address, 'Currently used implementation on Proxy contract should be V2 implementation after the upgrade');
        return tokenInstance.version.call();
      }).then(version => {
        assert.equal(version, testDataVersion, 'Currently used implementation version on Proxy contract should be 2 after the upgrade');
        return tokenInstance.getDataAddress(1);
      }).then(dataAddressV1 => {
        assert.equal(dataAddressV1, ERTTokenDataV1.address , 'the Data Contract V1 address should be preserved on proxy contract'); 
        return tokenInstance.getDataAddress(2);
      }).then(dataAddressV2 => {
        assert.equal(dataAddressV2, ERTTokenDataV2.address , 'the Data Contract V2 address should be preserved on proxy contract'); 
        return tokenInstance.getDataAddress(testDataVersion);
      }).then(testDataAddress => {
        assert.equal(testDataAddress, TestERTTokenNewDataVersion.address , 'the Test Data Contract address should be added on proxy contract'); 
        return ERTTokenDataV1.deployed();
      }).then(instance => {
        tokenDataV1Instance = instance;
        return tokenDataV1Instance.implementation.call();
      }).then(address => {
        assert.equal(address, TestTokenNewVersion.address , 'the Data Token should have transferred its ownership to implementation V2'); 
        return tokenDataV1Instance.proxy.call();
      }).then(address => {
        assert.equal(address, ERTToken.address , 'the Data Token should have transferred its ownership to implementation V2'); 
        return ERTTokenDataV2.deployed();
      }).then(instance => {
        tokenDataV2Instance = instance;
        return tokenDataV2Instance.implementation.call();
      }).then(address => {
        assert.equal(address, TestTokenNewVersion.address , 'the Data Token should have transferred its ownership to implementation V2'); 
        return tokenDataV2Instance.proxy.call();
      }).then(address => {
        assert.equal(address, ERTToken.address , 'the Data Token should have transferred its ownership to implementation V2'); 
        return TestERTTokenNewDataVersion.deployed();
      }).then(instance => {
        testDataVersionInstance = instance;
        return testDataVersionInstance.implementation.call();
      }).then(address => {
        assert.equal(address, TestTokenNewVersion.address , 'the Data Token V2 should have transferred its ownership to implementation V2'); 
        return testDataVersionInstance.proxy.call();
      }).then(address => {
        assert.equal(address, ERTToken.address , 'the Data Token V2 should have transferred its ownership to implementation V2'); 
        return web3.eth.getBalance(ERTToken.address);
      }).then(function(result) {
        assert.equal(String(result), fiveEtherInWei, 'the balance of the ERTToken should be 5 ether');
        return web3.eth.getBalance(ERTTokenV2.address);
      }).then(result => {
        assert.equal(result, 0, 'the balance of ERTTokenV2 should be 0 ');
        return web3.eth.getBalance(TestTokenNewVersion.address);
      }).then(function(result) {
        assert.equal(result, 0, 'the balance of TestERTokenV2 should be 0');
      });
  });

  it('Old implementation should be kept paused', function() {
   return ERTTokenV2.deployed()
     .then(instance => {
       tokenInstance = instance;
       return tokenInstance.paused.call();
     }).then(function(result) {
       assert.equal(result, true, 'old and useless implementation should be paused'); 
     });
  })

  it('New implementations should be kept paused', function() {
   return TestTokenNewVersion.deployed()
     .then(instance => {
       return instance.paused.call();
     }).then(function(result) {
       assert.equal(result, true, 'Test V1 implementation should be paused to avoid calling the contract impl directly');
       return TestTokenNewerVersion.deployed();
     }).then(instance => {
       return instance.paused.call();
     }).then(function(result) {
       assert.equal(result, true, 'Test V2 implementation should be paused to avoid calling the contract impl directly'); 
     });
  })

  it("Proxy contract shouldn't be paused", function() {
    return ERTToken.deployed()
      .then(instance => {
        tokenInstance = instance;
        return tokenInstance.paused.call();
      }).then(function(result) {
        assert.equal(result, false, "proxy contract shouldn't be paused"); 
      });
  })

  it('Test access to Data V1 information after upgrade', function() {
    return ERTToken.deployed()
      .then(instance => {
        tokenInstance = instance;  
        return tokenInstance.name();
      }).then(function(name) {
        assert.equal(name, 'Curries', 'has not the correct name');
        return tokenInstance.totalSupply();
      }).then(function(totalSupply) {
        assert.equal(totalSupply.toNumber(), 100000 * decimals, 'has not the correct totalSupply');
        return tokenInstance.isFrozen(accounts[5]);
      }).then(function(result) {
        assert.equal(result, false, 'accounts should be not freezen');
      });
  })

  it('Test Data write on proxy ', function() {
    return ERTToken.deployed()
      .then(instance => {
        tokenInstance = instance;  
        return tokenInstance.setSellPrice(web3.toWei("3", 'finney'));
      }).then(function(result) {
        return tokenInstance.getSellPrice();
      }).then(function(sellPrice) {
        assert.equal(sellPrice.toNumber(), web3.toWei("3", 'finney').toString(), 'writing for old implementation is wrong should be the new setting ');
      });
  })

  it('Test freeze feature added in V2 implementation', function() {
    return ERTToken.deployed()
      .then(instance => {
        tokenInstance = instance;  
        return tokenInstance.freeze(accounts[5]);
      }).then(function(result) {
        return tokenInstance.isFrozen(accounts[5]);
      }).then(function(result) {
        assert.equal(result, true, 'accounts should be frozen ');
        return tokenInstance.unFreeze(accounts[5]);
      }).then(function(result) {
        return tokenInstance.isFrozen(accounts[5]);
      }).then(function(result) {
        assert.equal(result, false, "accounts shouldn't be frozen");
        return tokenInstance.freeze(accounts[5]);
      }).then(() => {
        return tokenInstance.approveAccount(accounts[5]);
      }).then(() => {
        return tokenInstance.approveAccount(accounts[3]);
      }).then(() => {
        return tokenInstance.transfer(accounts[5], 50 * decimals);
      }).then(receipt => {
        return tokenInstance.balanceOf(accounts[5]);
      }).then(balance => {
        assert.equal(balance.toNumber(), 50 * decimals, 'Wrong balance of accounts[5]');
        return tokenInstance.transfer(accounts[3], 20 * decimals, {from : accounts[5]});
      }).then(assert.fail).catch(function(error) {
        assert(error.message.indexOf('revert') >= 0, "accounts[5] is frozen, thus he shouldn't be able to send his funds");
        return tokenInstance.unFreeze(accounts[5]);
      }).then(function(result) {
        return tokenInstance.isFrozen(accounts[5]);
      }).then(function(result) {
        assert.equal(result, false, "accounts[5] shouldn't be frozen");
        return tokenInstance.transfer(accounts[0], 20 * decimals, {from : accounts[5]});
      }).then(receipt => {
        return tokenInstance.balanceOf(accounts[5]);
      }).then(balance => {
        // Transfer is payed by Token, thus we can't check exact balance
        assert.isTrue(balance.toNumber() < 30 * decimals, 'Wrong balance of accounts[5]');
      });
  })

  it('Upgrade implementation to test Token V2', function() {
    return ERTToken.deployed()
      .then(instance => {
        tokenInstance = instance;
          return tokenInstance.implementationAddress.call();
        }).then(function(implementation) {
          assert.equal(implementation, TestTokenNewVersion.address, 'should return the current implementation');    
          return tokenInstance.upgradeImplementation(ERTToken.address, testTokenImplV2, TestTokenNewerVersion.address);
        }).then(function(receipt) {
          return tokenInstance.implementationAddress.call();
        }).then(function(implementation) {
          assert.equal(implementation, TestTokenNewerVersion.address, 'should return the given implementation'); 
        });
  })

  it('Test data addresses referenced in old V2 implementation', function() {
    return TestTokenNewVersion.deployed()
      .then(instance => {
        tokenInstance = instance;
        return tokenInstance.getDataAddress(1);
      }).then(function(result) {
        assert.equal(result, 0x0 , 'the TestTokenNewVersion shouldn\'t have a reference to new address'); 
      });
  });

  it('Old implementation should be paused', function() {
    return TestTokenNewVersion.deployed()
      .then(instance => {
        tokenInstance = instance;
        return tokenInstance.paused.call();
      }).then(function(result) {
        assert.equal(result, true , 'old and useless implementation should be paused'); 
      });
  })

  it('new implementation should be paused', function() {
    return TestTokenNewerVersion.deployed()
      .then(instance => {
        tokenInstance = instance;
        return tokenInstance.paused.call();
      }).then(function(result) {
        assert.equal(result, true, 'new implementation should be paused to avoid calling the contract impl directly'); 
      });
  })

  it('access to data and use Impl V2 and V1', function() {
    return ERTToken.deployed()
      .then(instance => {
        tokenInstance = instance;
        return tokenInstance.totalSupply();
      }).then(function(totalSupply) {
        assert.equal(totalSupply, 100000 * decimals, 'has not the correct totalSupply');
        return tokenInstance.freeze(accounts[6]);
      }).then(function(result) {
        return tokenInstance.isFrozen(accounts[6]);
      }).then(function(result) {
        assert.equal(result, true, 'accounts should be frozen ');
        return tokenInstance.approveAccount(accounts[6]);
      }).then(() => {
        return tokenInstance.transfer(accounts[6], String(50 * decimals));
      }).then(receipt => {
        return tokenInstance.unFreeze(accounts[6]);
      }).then(function(result) {
        return tokenInstance.transfer(accounts[0], String(20 * decimals), {from : accounts[6]});
      }).then(receipt => {
        return tokenInstance.balanceOf(accounts[6]);
      }).then(balance => {
        assert.isTrue(balance.toNumber() < 30 * decimals, 'Wrong balance of accounts[6], the sender is not Frozen so he made the transfer');
      });
  });

  it('Test new V3 implementation features: should Burn tokens', function () {
    return ERTToken.deployed().
      then(instance => {
        tokenInstance = instance ;
        return tokenInstance.burn(100001 * decimals);
      }).then(assert.fail).catch(function(error) {
        assert(error.message.indexOf('revert') >= 0, 'message must contain revert: no burn with value larger than the sender s balance');
        return tokenInstance.totalSupply();
      }).then(function (totalSupply){
        assert.equal(totalSupply.toNumber(), 100000  * decimals , 'the current total supply is wrong');
        return tokenInstance.burn(35 * decimals , {from : accounts[0]});
      }).then(function (receipt){
        assert(receipt.logs.length = 1,'number of emitted event is wrong');
        assert.equal(receipt.logs[0].event, 'Burn','should be the "Burn" event');
        assert.equal(receipt.logs[0].args.burner, accounts[0],'the account the tokens are burned from is wrong');
        assert.equal(receipt.logs[0].args.value, 35 * decimals,'the burned amount is wrong');
        return tokenInstance.totalSupply();
      }).then(function (totalSupply){
        assert.equal(totalSupply, (100000- 35) * decimals, 'the total Supply is wrong');
      });
  });

  it("Test new V3 implementation features: should mint token ", function() {
    return ERTToken.deployed()
      .then(instance => {
        tokenInstance = instance;
        return tokenInstance.balanceOf(accounts[1]);
      }).then(function(balance) {
        assert.equal(balance.valueOf(), 0, "it should be 0");
        return tokenInstance.mintToken(accounts[1], 50 * decimals, {from : accounts[0]});
      }).then(function(result) {
        assert.equal(result.logs.length, 3,'number of emitted event is wrong');
        assert.equal(result.logs[0].event, 'Transfer','should be the "Transfer" event');
        assert.equal(result.logs[0].args._from, 0,'the account the tokens are transferred from is wrong');
        assert.equal(result.logs[0].args._to, accounts[0],'the account the tokens are transferred to is wrong');
        assert.equal(result.logs[0].args._value, 50 * decimals,'the transfer amount is wrong');
        assert.equal(result.logs[1].event, 'Transfer','should be the "Transfer" event');
        assert.equal(result.logs[1].args._from, accounts[0],'the account the tokens are transferred from is wrong');
        assert.equal(result.logs[1].args._to, accounts[1],'the account the tokens are transferred to is wrong');
        assert.equal(result.logs[1].args._value, 50 * decimals,'the transfer amount is wrong')
        assert.equal(result.logs[2].event, 'MintedToken','should be the "MintedToken" event');
        assert.equal(result.logs[2].args.minter, accounts[0],'the account the tokens are transferred from is wrong');
        assert.equal(result.logs[2].args.target, accounts[1],'the account the tokens are transferred to is wrong');
        assert.equal(result.logs[2].args.mintedAmount, 50 * decimals,'the minted amount is wrong');
        return tokenInstance.balanceOf(accounts[1]);
      }).then(function(balance) {
        assert.equal(balance.valueOf(), 50 * decimals, "it should be 50 * 10 ^ 18");
        return tokenInstance.totalSupply();
      }).then(function(totalSupply) {
        assert.equal(totalSupply, (100000-35+50) * decimals, 'has not the correct totalSupply');  
      });
  });
});