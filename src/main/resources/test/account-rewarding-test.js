const ERTToken = artifacts.require("ERTToken");

const decimals = Math.pow(10, 18);

contract('AccountRewarding', function(accounts) {

  let tokenInstance;

  const accountToReward = "0x2d0e00D5c76F6b2F057B4888Ae74Faf6C78B6574";
  const accountsAdmin = accounts[1];

  let rewardingAccountTokenBalance, rewardedAccountTokenBalance;
  const tokensToReward = 3 * decimals;
  const tokensToTransfer = 2 * decimals;

  beforeEach(async function () {
    tokenInstance = await ERTToken.deployed();
  });

  it("Test reward account with admin not having enough privileges", () => {
    return tokenInstance.addAdmin(accountsAdmin, 1)
      .then(() => {
        // Approve account
        return tokenInstance.approveAccount(accountToReward, {
          from : accounts[0]
        });
      }).then(() => {
        // Transfer enough funds to admin account that will reward other accounts
        return tokenInstance.transfer(accountsAdmin, tokensToTransfer * 2, {
          from : accounts[0]
        })
      }).then(() => {
        return tokenInstance.reward(accountToReward, tokensToTransfer, tokensToReward, {
          from: accountsAdmin
        });
      }).then(assert.fail).catch((error) => {
        assert(error.message.indexOf('revert') >= 0, 'Admin level 1 shouldn\'t be able to reward an account');
      });
  });

  it('Test reward account with admin having enough privileges', () => {
    return tokenInstance.addAdmin(accountsAdmin, 2)
      .then(() => {
        // Approve account
        return tokenInstance.approveAccount(accountToReward, {
          from : accounts[0]
        });
      }).then(() => {
        // Transfer enough funds to admin account that will reward other accounts
        return tokenInstance.transfer(accountsAdmin, tokensToTransfer * 2, {
          from : accounts[0]
        })
      }).then((balance) => {
        return tokenInstance.balanceOf(accountToReward);
      }).then((balance) => {
        rewardedAccountTokenBalance = Number(balance);
        return tokenInstance.balanceOf(accountsAdmin);
      }).then((balance) => {
        rewardingAccountTokenBalance = Number(balance);

        // Send rewarded tokens
        return tokenInstance.reward(accountToReward, tokensToTransfer, tokensToReward, {
          from: accountsAdmin
        });
      }).then(() => {
        return tokenInstance.balanceOf(accountToReward);
      }).then((balance) => {
        assert.equal(Number(balance), rewardedAccountTokenBalance + tokensToTransfer, "Account should have received rewarded tokens");
        return tokenInstance.rewardBalanceOf(accountToReward);
      }).then((balance) => {
        assert.equal(Number(balance), tokensToReward, "Account should have been rewarded with thr exact amount of tokens sent");
        return tokenInstance.balanceOf(accountsAdmin);
      }).then((balance) => {
        assert.isAtMost(Number(balance), rewardingAccountTokenBalance - tokensToTransfer, "Admin account should have sent tokens from his balance while rewarding");
      });
  });

});
