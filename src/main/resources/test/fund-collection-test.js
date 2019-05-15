const ERTToken = artifacts.require("ERTToken");

contract('FundCollection', function(accounts) {
  it('Send ether to contract', function() {
    return ERTToken.deployed().then(function(instance) {
      tokenInstance = instance;
    }).then(() => {
      return web3.eth.getBalance(tokenInstance.address);
    }).then(balance => {
      assert.equal(balance, 0, 'Contract balance should be empty');
    }).then(() => {
      return web3.eth.sendTransaction({
        from : accounts[0],
        to: tokenInstance.address,
        value : web3.toWei("1","ether")
      });
    }).then(() => {
      return web3.eth.getBalance(tokenInstance.address);
    }).then(balance => {
      assert.equal(String(balance), String(web3.toWei(1,"ether")), 'Contract balance should be 1 ether');
    });
  });
});
