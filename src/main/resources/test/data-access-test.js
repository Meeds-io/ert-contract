const ERTToken = artifacts.require("ERTToken");
const ERTTokenDataV1 = artifacts.require("ERTTokenDataV1");

const decimals = Math.pow(10, 18);

contract('DataAccess', function(accounts) {
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

  it('test contract initialization attributes', () => {
    return ERTToken.deployed().then(instance => {
      tokenInstance = instance;
      return tokenInstance.getDataAddress(1);
    }).then(function(dataAddress) {
      assert.equal(dataAddress, ERTTokenDataV1.address, 'Token Implementation seems to have wrong data address');
      return tokenInstance.initialized();
    }).then(function(result) {
      assert.equal(result, true, 'Token Implementation data is not initialized');
      return tokenInstance.name();
    }).then(function(name) {
      assert.equal(name, 'Curries', 'has not the correct name');
      return tokenInstance.symbol();
    }).then(function(symbol) {
      assert.equal(symbol, 'C', 'has not the correct symbol');
      return tokenInstance.totalSupply();
    }).then(function(totalSupply) {
      assert.equal(totalSupply, 100000 * decimals, 'has not the correct totalSupply');
      return tokenInstance.decimals();
    }).then(function(decimals) {
      assert.equal(decimals, 18, 'has not the correct decimals');
      return tokenInstance.balanceOf(accounts[1]);
    }).then(function(balance) {
      assert.equal(balance, 0, 'wrong token balance for accounts[1]');
      return tokenInstance.balanceOf(accounts[0]);
    }).then(function(balance) {
      assert.equal(balance > decimals, true, 'wrong token balance for accounts[0]');
      return tokenInstance.approveAccount(accounts[1], {
        from : accounts[0]
      });
    }).then(receipt => {
      return tokenInstance.approve(accounts[1], 1 * decimals, {
        from : accounts[0]
      });
    }).then(receipt => {
      return tokenInstance.allowance(accounts[0], accounts[1]);
    }).then(allowed => {
      assert.equal(allowed.toNumber(), 1 * decimals, 'stores the allowance for delegated trasnfer');
      return tokenInstance.isApprovedAccount(accounts[0]);
    }).then(function(ownerApproved) {
      assert.equal(true, ownerApproved, 'Contract owner has to be approved');
      return tokenInstance.getSellPrice();
    }).then(function(sellPrice) {
      assert.equal(sellPrice.toNumber(), 2000000000000000 , 'token sell price is wrong');
      return tokenInstance.addAdmin(accounts[1], 1);
    }).then(receipt => {
      return tokenInstance.isAdmin(accounts[1], 1);
    }).then(result => {
      assert.equal(result , true, 'accounts[1] is not admin yet');
      return tokenInstance.isPaused();
    }).then(function(result) {
      assert.equal(result, false , 'ERC20 operation is paused');
    });
  })

  it('test setting Data', function() {
    return ERTToken.deployed().then(instance => {
      tokenInstance = instance;
      return tokenInstance.setName("ERC");
    }).then(receipt => {
      return tokenInstance.name();
    }).then(result => {
      assert.equal(result , "ERC", 'has not the correct name');
      return tokenInstance.setSymbol("R");
    }).then(receipt => {
      return tokenInstance.symbol();
    }).then(result => {
      assert.equal(result , "R", 'has not the correct symbol');
    });
  })

  it(`A simple user shouldn't be able to change name or symbol`, function() {
    let originalName,originalSymbol;
    return ERTToken.deployed().then(instance => {
      tokenInstance = instance;
      return tokenInstance.name();
    }).then(name => {
      originalName = name;
      return tokenInstance.symbol();
    }).then(symbol => {
      originalSymbol = symbol;
      return tokenInstance.setName(`${originalName} 2`, {from : accounts[8]});
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, 'accounts[8] shouldn\'t be able to change token name');  
    }).then(receipt => {
      return tokenInstance.name();
    }).then(result => {
      assert.equal(result , originalName, 'has not the correct name');
      // Test on symbol modification
      return tokenInstance.setSymbol(`${originalSymbol} 2`, {from : accounts[8]});
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, 'accounts[8] shouldn\'t be able to change token symbol');  
    }).then(receipt => {
      return tokenInstance.symbol();
    }).then(result => {
      assert.equal(result , originalSymbol, 'has not the correct Symbol');
    });
  })

  it(`An admin, but owner, shouldn't be able to change name or symbol`, function() {
    let originalName,originalSymbol;
    return ERTToken.deployed().then(instance => {
      tokenInstance = instance;
      return tokenInstance.addAdmin(accounts[8], 5);
    }).then(name => {
      return tokenInstance.name();
    }).then(name => {
      originalName = name;
      return tokenInstance.symbol();
    }).then(symbol => {
      originalSymbol = symbol;
      return tokenInstance.setName(`${originalName} 2`, {from : accounts[8]});
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, 'accounts[8] shouldn\'t be able to change token name');  
    }).then(receipt => {
      return tokenInstance.name();
    }).then(result => {
      assert.equal(result , originalName, 'has not the correct name');
      // Test on symbol modification
      return tokenInstance.setSymbol(`${originalSymbol} 2`, {from : accounts[8]});
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, 'accounts[8] shouldn\'t be able to change token symbol');  
    }).then(receipt => {
      return tokenInstance.symbol();
    }).then(result => {
      assert.equal(result , originalSymbol, 'has not the correct Symbol');
    });
  })

  it('send ether to data contract should be forbidden ', function() {
    return ERTToken.deployed()
      .then(instance => {
        tokenInstance = instance;
        return web3.eth.sendTransaction({
          from : accounts[0],
          to: ERTTokenDataV1.address,
          value : web3.toWei("1", 'ether')
        });
      })
      .then(assert.fail).catch(error => {
        assert.isTrue(String(error).indexOf('revert') >= 0, "Ether transfer should be reverted");
        return web3.eth.getBalance(ERTTokenDataV1.address);
      }).then(result => 
        assert.equal(Number(String(result)), 0, `The data contract should have 0 ether in its balance`)
      );
  });

});



