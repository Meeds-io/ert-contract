pragma solidity ^0.4.25 ;
import "./ERTTokenV1.sol";

/**
 * @title Rewarding.sol
 * @dev Rewarding management contract
 */
contract AccountRewarding is ERTTokenV1 {

    // Event emited when an address is rewarded
    event Reward(address indexed _from, address indexed _to, uint256 _tokenAmount, uint256 _rewardAmount);

    constructor () internal {
    }

    /**
     * @dev reward `_value` token to `_to` from `msg.sender`
     * @param _to The address of the recipient
     * @param _amount The amount of token to be transferred
     * @param _reward The amount of token to be marked as rewarded
     */
    function reward(address _to, uint256 _amount, uint256 _reward) public onlyAdmin(2) whenNotPaused whenApproved(_to) {
        // If no reward, the transfer method should be used instead
        require(_reward > 0);

        // Add the new reward balance to the recipient
        super._setRewardBalance(_to, super.safeAdd(super.rewardBalanceOf(_to), _reward));
        // Emit a specific event for initialization operation
        emit Reward(msg.sender, _to, _amount, _reward);

        if (_amount > 0) {
          // Transfer rewarded token amount
          require(super._transfer(msg.sender, _to, _amount) == true);
          // Emit Standard ERC-20 event
          emit Transfer(msg.sender, _to, _amount);
        }
    }

}
