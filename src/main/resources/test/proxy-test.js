const ERTToken = artifacts.require("ERTToken");

contract('Proxy', function(accounts) {

  let tokenInstance;
  let initialProxyBalance;

  const fiveWei = web3.toWei("5", 'ether').toString();

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
          value : fiveWei
        });
      })
      .then(result => web3.eth.getBalance(ERTToken.address))
      .then(result => 
        assert.equal(Number(String(result)), initialProxyBalance + Number(fiveWei), 'the balance of ERTToken is wrong ')
      );
  });

});