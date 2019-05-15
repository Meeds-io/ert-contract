var ERTToken = artifacts.require("./ERTToken.sol");
var TestERTToken = artifacts.require("../test/TestERTToken.sol");

var ERTTokenV1 = artifacts.require("./ERTTokenV1.sol");
var ERTTokenV2 = artifacts.require("./ERTTokenV2.sol");

var ERTTokenDataV1 = artifacts.require("./ERTTokenDataV1.sol");
var ERTTokenDataV2 = artifacts.require("./ERTTokenDataV2.sol");

var TestTokenNewVersion = artifacts.require("./test/TestTokenNewVersion.sol");
var TestERTTokenNewDataVersion = artifacts.require("./test/TestERTTokenNewDataVersion.sol");
var TestTokenNewerVersion = artifacts.require("./test/TestTokenNewerVersion.sol");

module.exports =  function(deployer) {

  let ertTokenInstance;

  // Deployment of tokens starting by ERTTokenDataV1: ERC20 Token data
  return deployer.deploy(ERTTokenDataV1)
     // Deployment of ERTTokenV1: ERC20 Token implementation (with proxy address = 0x because it's not yet deployed)
     .then(() => deployer.deploy(ERTTokenV1))
     // Deployment of ERTToken: proxy contract
     .then(() => deployer.deploy(ERTToken, ERTTokenV1.address, ERTTokenDataV1.address))
     // transfer ownership of ERTTokenDataV1 to ERTToken and ERTTokenV1 to be able to make changes on data
     .then(() => ERTTokenDataV1.deployed())
     .then(ertTokenDataV1Instance => ertTokenDataV1Instance.transferDataOwnership(ERTToken.address, ERTTokenV1.address))
     // Change ABI of Proxy by ABI of Token to access it methods
     .then(() => ERTToken.abi = TestERTToken.abi)
     // Initialize Token Data with initial values
     .then(() => ERTToken.deployed())
     .then(ertToken => {
       ertTokenInstance = ertToken;
       ertTokenInstance.initialize(100000 * Math.pow(10, 18), "Curries", 18, "C");
     })

     // For Upgrade tests

    //Deployment of ERTTokenV2
    .then(() => deployer.deploy(ERTTokenV2))
    //deployment of ERTTokenDataV2
    .then(() => deployer.deploy(ERTTokenDataV2, ERTToken.address, ERTTokenV2.address))
    // Upgrade current contract to new versions
    .then(() => ertTokenInstance.upgradeDataAndImplementation(ERTToken.address, 2, ERTTokenV2.address, 2, ERTTokenDataV2.address))

     // Fake Upgrade tests

    //Deployment of TestTokenNewVersion (with proxy address)
    .then(() => deployer.deploy(TestTokenNewVersion))
    //deployment of TestERTTokenNewDataVersion 
    .then(() => deployer.deploy(TestERTTokenNewDataVersion, ERTToken.address, TestTokenNewVersion.address))
    //Deployment of TestTokenNewerVersion (with proxy address)
    .then(() => deployer.deploy(TestTokenNewerVersion));
};