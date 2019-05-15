const ERTToken = artifacts.require("ERTToken");
const ERTTokenV2 = artifacts.require("ERTTokenV2");

contract('Pausable', function(accounts) {

  let tokenInstance;
  let tokenV2Instance;

  async function setTokenInstance() {
    tokenInstance = await ERTToken.deployed();
    tokenV2Instance = await ERTTokenV2.deployed();
    const paused = await tokenInstance.isPaused();
    if (paused)  {
      await tokenInstance.unPause();
    }
  }

  beforeEach(async function () {
    await setTokenInstance();
  });

  it('test pause status of contracts', function() {
    return tokenInstance.isPaused()
      .then(paused => {
        assert.equal(paused, false, 'Proxy contract seems to be unexpectedly paused');
        return tokenV2Instance.isPaused();
      }).then(paused => {
        assert.equal(paused, true, 'Implementation V2 contract should be paused to not allow users to use it directly but through the proxy contract');
      });
  });

  it('test pause', function() {
    return tokenInstance.pause()
      .then(receipt => {
        const pauseLog = receipt.logs.find(log => log.event === 'ContractPaused');
        assert.isDefined(pauseLog, 'ContractPaused event is expected');
        return tokenInstance.isPaused();
      }).then(paused => {
        assert.equal(paused, true,
            'Contract seems to be unexpectedly unPaused after using pause() method');
      });
  });

  it('test unPause ', function() {
    return tokenInstance.isPaused()
      .then(paused => {
        assert.equal(paused, false, 'Proxy contract seems to be unexpectedly paused');
        return tokenInstance.pause();
      }).then(() => {
        return tokenInstance.unPause();
      }).then(receipt => {
        const unpauseLog = receipt.logs.find(log => log.event === 'ContractUnPaused');
        assert.isDefined(unpauseLog, 'ContractUnPaused event is expected');
        return tokenInstance.isPaused();
      }).then(paused => {
        assert.equal(paused, false,
            'Contract seems to be unexpectedly paused after using unPause() method');
      });
  });
});
