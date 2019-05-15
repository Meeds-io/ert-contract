const ERTTokenV1 = artifacts.require("ERTTokenV2");
const ERTTokenDataV1 = artifacts.require("ERTTokenDataV1");
const ERTTokenDataV2 = artifacts.require("ERTTokenDataV2");

const decimals = Math.pow(10, 18);

contract('ERTTokenV2 ABI', function() {

  const abi = ERTTokenV1.abi;

  it (`Abi elements count` , function(){
    assert.equal(abi.length, 60, `Token Abi isn't coherent`);
    assert.equal(abi.filter(element => element.stateMutability === 'view').length, 20, `Token Abi doesn't have exact match functions in view mode`);
    assert.equal(abi.filter(element => element.stateMutability === 'nonpayable').length, 19, `Token Abi doesn't have exact match for nonpayable functions`);
    assert.equal(abi.filter(element => element.stateMutability === 'payable').length, 2, `Token Abi doesn't have exact match for payable functions`);
    assert.equal(abi.filter(element => element.type === 'function').length, 40, `Token Abi doesn't have exact match functions with type 'function'`);
    assert.equal(abi.filter(element => element.type === 'fallback').length, 1, `Token Abi doesn't have exact match functions with type 'fallback'`);
    assert.equal(abi.filter(element => element.type === 'constructor').length, 0, `Token Abi doesn't have exact match functions with type 'constructor'`);
    assert.equal(abi.filter(element => element.type === 'event').length, 19, `Token Abi doesn't have exact match functions with type 'event'`);
  });

  it (`Abi doesn't expose internal methods` , function(){
    assert.equal(abi.filter(element => element.type === 'function' && element.name.indexOf('_') >= 0).length, 0, `Token Abi shouldn't have a supposed internal method into it`);
  });

  it (`Abi have ERC20 methods` , function(){
    assert.equal(abi.filter(element => element.type === 'function' && element.name === 'transfer' && element.inputs && element.inputs.length === 2).length, 1, `Token Abi doesn't have ERC20 'transfer' method`);
    assert.equal(abi.filter(element => element.type === 'function' && element.name === 'approve' && element.inputs && element.inputs.length === 2).length, 1, `Token Abi doesn't have ERC20 'approve' method`);
    assert.equal(abi.filter(element => element.type === 'function' && element.name === 'transferFrom' && element.inputs && element.inputs.length === 3).length, 1, `Token Abi doesn't have ERC20 'transferFrom' method`);
    assert.equal(abi.filter(element => element.type === 'function' && element.name === 'balanceOf' && element.inputs && element.inputs.length === 1).length, 1, `Token Abi doesn't have ERC20 'balanceOf' method`);
    assert.equal(abi.filter(element => element.type === 'function' && element.name === 'allowance' && element.inputs && element.inputs.length === 2).length, 1, `Token Abi doesn't have ERC20 'allowance' method`);
  });

  it (`Abi have Admin.sol methods` , function(){
    assert.equal(abi.filter(element => element.type === 'function' && element.name === 'addAdmin' && element.inputs && element.inputs.length === 2).length, 1, `Token Abi doesn't have 'addAdmin' method`);
    assert.equal(abi.filter(element => element.type === 'function' && element.name === 'removeAdmin' && element.inputs && element.inputs.length === 1).length, 1, `Token Abi doesn't have 'removeAdmin' method`);
    assert.equal(abi.filter(element => element.type === 'function' && element.name === 'isAdmin' && element.inputs && element.inputs.length === 2).length, 1, `Token Abi doesn't have 'isAdmin' method`);
    assert.equal(abi.filter(element => element.type === 'function' && element.name === 'getAdminLevel' && element.inputs && element.inputs.length === 1).length, 1, `Token Abi doesn't have 'getAdminLevel' method`);
  });

  it (`Abi have ApprouvableAccount.sol methods` , function(){
    assert.equal(abi.filter(element => element.type === 'function' && element.name === 'approveAccount' && element.inputs && element.inputs.length === 1).length, 1, `Token Abi doesn't have 'approveAccount' method`);
    assert.equal(abi.filter(element => element.type === 'function' && element.name === 'disapproveAccount' && element.inputs && element.inputs.length === 1).length, 1, `Token Abi doesn't have 'disapproveAccount' method`);
    assert.equal(abi.filter(element => element.type === 'function' && element.name === 'isApprovedAccount' && element.inputs && element.inputs.length === 1).length, 1, `Token Abi doesn't have 'isApprovedAccount' method`);
  });

  it (`Abi have DataAccess.sol methods` , function(){
    assert.equal(abi.filter(element => element.type === 'function' && element.name === 'getDataAddress' && element.inputs && element.inputs.length === 1).length, 1, `Token Abi doesn't have 'getDataAddress' method`);
    assert.equal(abi.filter(element => element.type === 'function' && element.name === 'initialized' && element.inputs && element.inputs.length === 0).length, 1, `Token Abi doesn't have 'initialized' method`);
    assert.equal(abi.filter(element => element.type === 'function' && element.name === 'name' && element.inputs && element.inputs.length === 0).length, 1, `Token Abi doesn't have 'name' method`);
    assert.equal(abi.filter(element => element.type === 'function' && element.name === 'symbol' && element.inputs && element.inputs.length === 0).length, 1, `Token Abi doesn't have 'symbol' method`);
    assert.equal(abi.filter(element => element.type === 'function' && element.name === 'totalSupply' && element.inputs && element.inputs.length === 0).length, 1, `Token Abi doesn't have 'totalSupply' method`);
    assert.equal(abi.filter(element => element.type === 'function' && element.name === 'decimals' && element.inputs && element.inputs.length === 0).length, 1, `Token Abi doesn't have 'decimals' method`);
    assert.equal(abi.filter(element => element.type === 'function' && element.name === 'getSellPrice' && element.inputs && element.inputs.length === 0).length, 1, `Token Abi doesn't have 'getSellPrice' method`);
    assert.equal(abi.filter(element => element.type === 'function' && element.name === 'setName' && element.inputs && element.inputs.length === 1).length, 1, `Token Abi doesn't have 'setName' method`);
    assert.equal(abi.filter(element => element.type === 'function' && element.name === 'setSymbol' && element.inputs && element.inputs.length === 1).length, 1, `Token Abi doesn't have 'setSymbol' method`);
    assert.equal(abi.filter(element => element.type === 'function' && element.name === 'isInitializedAccount' && element.inputs && element.inputs.length === 1).length, 1, `Token Abi doesn't have 'isInitializedAccount' method`);
    assert.equal(abi.filter(element => element.type === 'function' && element.name === 'rewardBalanceOf' && element.inputs && element.inputs.length === 1).length, 1, `Token Abi doesn't have 'rewardBalanceOf' method`);
    assert.equal(abi.filter(element => element.type === 'function' && element.name === 'vestingBalanceOf' && element.inputs && element.inputs.length === 1).length, 1, `Token Abi doesn't have 'vestingBalanceOf' method`);
  });

  it (`Abi have ERTTokenV1.sol methods` , function(){
    assert.equal(abi.filter(element => element.type === 'function' && element.name === 'initialize' && element.inputs && element.inputs.length === 4).length, 1, `Token Abi doesn't have 'initialize' method`);
  });

  it (`Abi have FundCollection.sol methods` , function(){
    assert.equal(abi.filter(element => element.type === 'fallback').length, 1, `Token Abi doesn't have a fallback function to receive ether`);
  });

  it (`Abi have GasPayableInToken.sol methods` , function(){
    assert.equal(abi.filter(element => element.type === 'function' && element.name === 'setSellPrice' && element.inputs && element.inputs.length === 1).length, 1, `Token Abi doesn't have 'setSellPrice' method`);
  });

  it (`Abi have Owned.sol methods` , function(){
    assert.equal(abi.filter(element => element.type === 'function' && element.name === 'transferOwnership' && element.inputs && element.inputs.length === 1).length, 1, `Token Abi doesn't have 'transferOwnership' method`);
  });

  it (`Abi have Pausable.sol methods` , function(){
    assert.equal(abi.filter(element => element.type === 'function' && element.name === 'isPaused' && element.inputs && element.inputs.length === 0).length, 1, `Token Abi doesn't have 'isPaused' method`);
    assert.equal(abi.filter(element => element.type === 'function' && element.name === 'pause' && element.inputs && element.inputs.length === 0).length, 1, `Token Abi doesn't have 'pause' method`);
    assert.equal(abi.filter(element => element.type === 'function' && element.name === 'unPause' && element.inputs && element.inputs.length === 0).length, 1, `Token Abi doesn't have 'unPause' method`);
  });

  it (`Abi have TokenStorage.sol methods` , function(){
    assert.equal(abi.filter(element => element.type === 'function' && element.name === 'implementationAddress' && element.inputs && element.inputs.length === 0).length, 1, `Token Abi doesn't have 'implementationAddress' method`);
    assert.equal(abi.filter(element => element.type === 'function' && element.name === 'owner' && element.inputs && element.inputs.length === 0).length, 1, `Token Abi doesn't have 'owner' method`);
    assert.equal(abi.filter(element => element.type === 'function' && element.name === 'paused' && element.inputs && element.inputs.length === 0).length, 1, `Token Abi doesn't have 'paused' method`);
    assert.equal(abi.filter(element => element.type === 'function' && element.name === 'version' && element.inputs && element.inputs.length === 0).length, 1, `Token Abi doesn't have 'version' method`);
  });

  it (`Abi have Upgradability.sol methods` , function(){
    assert.equal(abi.filter(element => element.type === 'function' && element.name === 'upgradeImplementation' && element.inputs && element.inputs.length === 3).length, 1, `Token Abi doesn't have 'upgradeImplementation' method`);
    assert.equal(abi.filter(element => element.type === 'function' && element.name === 'upgradeDataAndImplementation' && element.inputs && element.inputs.length === 5).length, 1, `Token Abi doesn't have 'upgradeDataAndImplementation' method`);
    assert.equal(abi.filter(element => element.type === 'function' && element.name === 'upgradeData' && element.inputs && element.inputs.length === 2).length, 1, `Token Abi doesn't have 'upgradeData' method`);
  });
  
  it (`Abi have AccountInitialization.sol methods` , function(){
    assert.equal(abi.filter(element => element.type === 'function' && element.name === 'initializeAccount' && element.inputs && element.inputs.length === 2).length, 1, `Token Abi doesn't have 'initializeAccount' method`);
  });

  it (`Abi have AccountRewarding.sol methods` , function(){
    assert.equal(abi.filter(element => element.type === 'function' && element.name === 'reward' && element.inputs && element.inputs.length === 3).length, 1, `Token Abi doesn't have 'reward' method`);
  });
  
  it (`Abi have TokenVesting.sol methods` , function(){
    assert.equal(abi.filter(element => element.type === 'function' && element.name === 'transformToVested' && element.inputs && element.inputs.length === 2).length, 1, `Token Abi doesn't have 'transformToVested' method`);
  });

});

contract('ERTTokenDataV1 ABI', function() {
  const dataAbi = ERTTokenDataV1.abi;

  it (`Data abi elements count` , function(){
    assert.equal(dataAbi.length, 29, `Token Abi isn't coherent`);
    assert.equal(dataAbi.filter(element => element.stateMutability === 'view').length, 14, `Token Data Abi doesn't have exact match functions in view mode`);
    assert.equal(dataAbi.filter(element => element.stateMutability === 'nonpayable').length, 14, `Token Data Abi doesn't have exact match for nonpayable functions`);
    assert.equal(dataAbi.filter(element => element.stateMutability === 'payable').length, 0, `Token Data Abi doesn't have exact match for payable functions`);
    assert.equal(dataAbi.filter(element => element.type === 'function').length, 26, `Token Data Abi doesn't have exact match functions with type 'function'`);
    assert.equal(dataAbi.filter(element => element.type === 'fallback').length, 1, `Token Data Abi doesn't have exact match functions with type 'fallback'`);
    assert.equal(dataAbi.filter(element => element.type === 'constructor').length, 1, `Token Data Abi doesn't have exact match functions with type 'constructor'`);
    assert.equal(dataAbi.filter(element => element.type === 'event').length, 1, `Token Data Abi doesn't have exact match functions with type 'event'`);
  });

  it (`Data abi doesn't expose internal methods` , function(){
    assert.equal(dataAbi.filter(element => element.type === 'function' && element.name.indexOf('_') >= 0).length, 0, `Token Abi shouldn't have a supposed internal method into it`);
  });

  it (`Data abi have DataOwned.sol methods` , function(){
    assert.equal(dataAbi.filter(element => element.type === 'function' && element.name === 'proxy' && element.inputs && element.inputs.length === 0).length, 1, `Token Abi doesn't have 'proxy' method`);
    assert.equal(dataAbi.filter(element => element.type === 'function' && element.name === 'implementation' && element.inputs && element.inputs.length === 0).length, 1, `Token Abi doesn't have 'implementation' method`);
    assert.equal(dataAbi.filter(element => element.type === 'function' && element.name === 'transferDataOwnership' && element.inputs && element.inputs.length === 2).length, 1, `Token Abi doesn't have 'transferDataOwnership' method`);
  });

  it (`Data abi have ERTTokenDataV1.sol methods` , function(){
    assert.equal(dataAbi.filter(element => element.type === 'function' && element.name === 'initialized' && element.inputs && element.inputs.length === 0).length, 1, `Token Abi doesn't have 'initialized' method`);
    assert.equal(dataAbi.filter(element => element.type === 'function' && element.name === 'name' && element.inputs && element.inputs.length === 0).length, 1, `Token Abi doesn't have 'name' method`);
    assert.equal(dataAbi.filter(element => element.type === 'function' && element.name === 'symbol' && element.inputs && element.inputs.length === 0).length, 1, `Token Abi doesn't have 'symbol' method`);
    assert.equal(dataAbi.filter(element => element.type === 'function' && element.name === 'decimals' && element.inputs && element.inputs.length === 0).length, 1, `Token Abi doesn't have 'decimals' method`);
    assert.equal(dataAbi.filter(element => element.type === 'function' && element.name === 'balance' && element.inputs && element.inputs.length === 1).length, 1, `Token Abi doesn't have 'balance' method`);
    assert.equal(dataAbi.filter(element => element.type === 'function' && element.name === 'getAllowance' && element.inputs && element.inputs.length === 2).length, 1, `Token Abi doesn't have 'getAllowance' method`);
    assert.equal(dataAbi.filter(element => element.type === 'function' && element.name === 'isApprovedAccount' && element.inputs && element.inputs.length === 1).length, 1, `Token Abi doesn't have 'isApprovedAccount' method`);
    assert.equal(dataAbi.filter(element => element.type === 'function' && element.name === 'getSellPrice' && element.inputs && element.inputs.length === 0).length, 1, `Token Abi doesn't have 'getSellPrice' method`);
    assert.equal(dataAbi.filter(element => element.type === 'function' && element.name === 'isAdmin' && element.inputs && element.inputs.length === 2).length, 1, `Token Abi doesn't have 'isAdmin' method`);
    assert.equal(dataAbi.filter(element => element.type === 'function' && element.name === 'getAdminLevel' && element.inputs && element.inputs.length === 1).length, 1, `Token Abi doesn't have 'getAdminLevel' method`);
    assert.equal(dataAbi.filter(element => element.type === 'function' && element.name === 'isPaused' && element.inputs && element.inputs.length === 0).length, 1, `Token Abi doesn't have 'isPaused' method`);
    assert.equal(dataAbi.filter(element => element.type === 'function' && element.name === 'setInitialized' && element.inputs && element.inputs.length === 0).length, 1, `Token Abi doesn't have 'setInitialized' method`);
    assert.equal(dataAbi.filter(element => element.type === 'function' && element.name === 'setPaused' && element.inputs && element.inputs.length === 1).length, 1, `Token Abi doesn't have 'setPaused' method`);
    assert.equal(dataAbi.filter(element => element.type === 'function' && element.name === 'setName' && element.inputs && element.inputs.length === 1).length, 1, `Token Abi doesn't have 'setName' method`);
    assert.equal(dataAbi.filter(element => element.type === 'function' && element.name === 'setSymbol' && element.inputs && element.inputs.length === 1).length, 1, `Token Abi doesn't have 'setSymbol' method`);
    assert.equal(dataAbi.filter(element => element.type === 'function' && element.name === 'setTotalSupply' && element.inputs && element.inputs.length === 1).length, 1, `Token Abi doesn't have 'setTotalSupply' method`);
    assert.equal(dataAbi.filter(element => element.type === 'function' && element.name === 'setBalance' && element.inputs && element.inputs.length === 2).length, 1, `Token Abi doesn't have 'setBalance' method`);
    assert.equal(dataAbi.filter(element => element.type === 'function' && element.name === 'setDecimals' && element.inputs && element.inputs.length === 1).length, 1, `Token Abi doesn't have 'setDecimals' method`);
    assert.equal(dataAbi.filter(element => element.type === 'function' && element.name === 'setAllowance' && element.inputs && element.inputs.length === 3).length, 1, `Token Abi doesn't have 'setAllowance' method`);
    assert.equal(dataAbi.filter(element => element.type === 'function' && element.name === 'setApprovedAccount' && element.inputs && element.inputs.length === 2).length, 1, `Token Abi doesn't have 'setApprovedAccount' method`);
    assert.equal(dataAbi.filter(element => element.type === 'function' && element.name === 'setSellPrice' && element.inputs && element.inputs.length === 1).length, 1, `Token Abi doesn't have 'setSellPrice' method`);
  });

})

contract('ERTTokenDataV2 ABI', function() {
  const dataAbi = ERTTokenDataV2.abi;
  
  it (`Data abi elements count` , function(){
    assert.equal(dataAbi.length, 12, `Token Abi isn't coherent`);
    assert.equal(dataAbi.filter(element => element.stateMutability === 'view').length, 5, `Token Data Abi doesn't have exact match functions in view mode`);
    assert.equal(dataAbi.filter(element => element.stateMutability === 'nonpayable').length, 6, `Token Data Abi doesn't have exact match for nonpayable functions`);
    assert.equal(dataAbi.filter(element => element.stateMutability === 'payable').length, 0, `Token Data Abi doesn't have exact match for payable functions`);
    assert.equal(dataAbi.filter(element => element.type === 'function').length, 9, `Token Data Abi doesn't have exact match functions with type 'function'`);
    assert.equal(dataAbi.filter(element => element.type === 'fallback').length, 1, `Token Data Abi doesn't have exact match functions with type 'fallback'`);
    assert.equal(dataAbi.filter(element => element.type === 'constructor').length, 1, `Token Data Abi doesn't have exact match functions with type 'constructor'`);
    assert.equal(dataAbi.filter(element => element.type === 'event').length, 1, `Token Data Abi doesn't have exact match functions with type 'event'`);
  });
  
  it (`Data abi doesn't expose internal methods` , function(){
    assert.equal(dataAbi.filter(element => element.type === 'function' && element.name.indexOf('_') >= 0).length, 0, `Token Abi shouldn't have a supposed internal method into it`);
  });
  
  it (`Data abi have DataOwned.sol methods` , function(){
    assert.equal(dataAbi.filter(element => element.type === 'function' && element.name === 'proxy' && element.inputs && element.inputs.length === 0).length, 1, `Token Abi doesn't have 'proxy' method`);
    assert.equal(dataAbi.filter(element => element.type === 'function' && element.name === 'implementation' && element.inputs && element.inputs.length === 0).length, 1, `Token Abi doesn't have 'implementation' method`);
    assert.equal(dataAbi.filter(element => element.type === 'function' && element.name === 'transferDataOwnership' && element.inputs && element.inputs.length === 2).length, 1, `Token Abi doesn't have 'transferDataOwnership' method`);
  });

  it (`Data abi have ERTTokenDataV2.sol methods` , function(){
    assert.equal(dataAbi.filter(element => element.type === 'function' && element.name === 'isInitializedAccount' && element.inputs && element.inputs.length === 1).length, 1, `Token Abi doesn't have 'isInitializedAccount' method`);
    assert.equal(dataAbi.filter(element => element.type === 'function' && element.name === 'setInitializedAccount' && element.inputs && element.inputs.length === 1).length, 1, `Token Abi doesn't have 'setInitializedAccount' method`);
    assert.equal(dataAbi.filter(element => element.type === 'function' && element.name === 'rewardBalanceOf' && element.inputs && element.inputs.length === 1).length, 1, `Token Abi doesn't have 'rewardBalanceOf' method`);
    assert.equal(dataAbi.filter(element => element.type === 'function' && element.name === 'setRewardBalance' && element.inputs && element.inputs.length === 2).length, 1, `Token Abi doesn't have 'setRewardBalance' method`);
    assert.equal(dataAbi.filter(element => element.type === 'function' && element.name === 'vestingBalanceOf' && element.inputs && element.inputs.length === 1).length, 1, `Token Abi doesn't have 'vestingBalanceOf' method`);
    assert.equal(dataAbi.filter(element => element.type === 'function' && element.name === 'setVestingBalance' && element.inputs && element.inputs.length === 2).length, 1, `Token Abi doesn't have 'setVestingBalance' method`);
  });
  
})
