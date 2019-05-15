const ERTToken = artifacts.require("ERTToken");

const decimals = Math.pow(10, 18);

contract('AccountInitialization', function(accounts) {

  let tokenInstance;

  const accountToInitialize = "0x42027e1DA0FDcB45d50D6a7B184Ced129b6AcF30";
  const accountsAdmin = accounts[1];

  beforeEach(async function () {
    tokenInstance = await ERTToken.deployed();
  });

  it('Test that account is not initialized', () => {
    return tokenInstance.isInitializedAccount(accountToInitialize)
      .then(initializedAccount => {
        assert.equal(initializedAccount, false, "Account shouldn't be initialized yet");
      });
  });

  it('Test initialize account with admin has\'t enough privileges', () => {
    return tokenInstance.addAdmin(accountsAdmin, 3)
      .then(() => {
        return tokenInstance.initializeAccount(accountToInitialize, 0, {
          from: accountsAdmin
        });
      }).then(assert.fail).catch((error) => {
        assert(error.message.indexOf('revert') >= 0, 'Admin level 3 shouldn\'t be able to initialize an account');
      });
  });

  let receiverTokenBalance, receiverEtherBalance, senderTokenBalance, senderEtherBalance;
  const etherToSend = 2 * decimals, tokensToSend = 2 * decimals;

  it('Test initialize account with admin having enough privileges', () => {
    return tokenInstance.balanceOf(accountToInitialize)
      .then((balance) => {
        receiverTokenBalance = balance;
        return web3.eth.getBalance(accountToInitialize);
      }).then((balance) => {
        receiverEtherBalance = Number(balance);
        return web3.eth.getBalance(accountsAdmin);
      }).then((balance) => {
        senderEtherBalance = Number(balance);
        return tokenInstance.balanceOf(accounts[0]);
      }).then((balance) => {
        assert.isAbove(senderEtherBalance, etherToSend, 'Ether to send for account initialization should be less than ether balance of admin account');

        // Give admin account enough privileges
        return tokenInstance.addAdmin(accountsAdmin, 4, {
          from : accounts[0]
        });
      }).then(() => {
        // Give admin account enough tokens to initialize account
        return tokenInstance.transfer(accountsAdmin, String(tokensToSend * 2), {
          from : accounts[0]
        });
      }).then(() => {
        return tokenInstance.balanceOf(accountsAdmin);
      }).then((balance) => {
        senderTokenBalance = balance;
        assert.isAbove(Number(senderTokenBalance), tokensToSend, 'Tokens to send for account initialization should be less than tokens balance of admin account');
        return tokenInstance.isApprovedAccount(accountToInitialize);
      }).then((approvedAccount) => {
        assert.equal(approvedAccount, false, "Account shouldn't be approved yet");

        return tokenInstance.initializeAccount(accountToInitialize, tokensToSend, {
          from: accountsAdmin,
          value: etherToSend
        });
      }).then(() => {
        return tokenInstance.isInitializedAccount(accountToInitialize)
      }).then(initializedAccount => {
        assert.equal(initializedAccount, true, "Account should be marked as initialized");
        return tokenInstance.isApprovedAccount(accountToInitialize);
      }).then((approvedAccount) => {
        assert.equal(approvedAccount, true, "Account should be approved");
        return tokenInstance.balanceOf(accountToInitialize);
      }).then((balance) => {
        assert.equal(Number(balance), receiverTokenBalance + tokensToSend, "Account should have received tokens sent while initializing his account");
        return web3.eth.getBalance(accountToInitialize);
      }).then((balance) => {
        assert.equal(Number(balance), receiverEtherBalance + etherToSend, "Account should have received ethers sent while initializing his account");
        return tokenInstance.balanceOf(accountsAdmin);
      }).then((balance) => {
        assert.equal(Number(balance), senderTokenBalance - tokensToSend, "Admin account should have sent tokens from his balance while initializing an account");
        return web3.eth.getBalance(accountsAdmin);
      }).then((balance) => {
        assert.isBelow(Number(balance), senderEtherBalance - etherToSend, "Admin account should have sent ethers from his balance while initializing an account");
      });
  });

  const accountToInitializeTwice = "0x329f9AC39a4eE98Da4bCC198E4E1b9b3E728e1FF";

  it('Ensure that couldn\'t re-initialize an account again', () => {
    return tokenInstance.addAdmin(accountsAdmin, 4)
      .then(() => {
        return tokenInstance.initializeAccount(accountToInitializeTwice, 0, {
          from: accountsAdmin
        });
      }).then(() => {
        return tokenInstance.initializeAccount(accountToInitializeTwice, 0, {
          from: accountsAdmin
        });
      }).then(assert.fail).catch((error) => {
        assert(error.message.indexOf('revert') >= 0, 'Shouldn\'t be able to re-initialize an account');
      });
  });

});
