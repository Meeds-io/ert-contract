pragma solidity ^0.4.25 ;
import "./ERTTokenV1.sol";

/**
 * @title AccountInitialization.sol
 * @dev account initialization to prepare it to use Tokens
 */
contract AccountInitialization is ERTTokenV1 {

    // Event emited when an address is initialized
    event Initialization(address indexed _from, address indexed _to, uint256 _tokenAmount, uint256 _etherAmount);

    constructor () internal {
    }

    /**
     * @dev `msg.sender` initializes `_to` account with token and ether initial amounts
     * The ether is sent using msg.value and the tokens are sent from msg.sender balance
     * @param _to The address of the account to initialize
     * @param _tokenAmount The amount of tokens to be transfered for account to init
     */
    function initializeAccount(address _to, uint256 _tokenAmount) public payable onlyAdmin(4) whenNotPaused {
        // Shouldn't initialize a contract address
        require(!super._isContract(_to));

        // Test if the account has already been initialized
        require(!super.isInitializedAccount(_to));

        // Mark address as initialized
        super._setInitializedAccount(_to);
        // Emit a specific event for initialization operation
        emit Initialization(msg.sender, _to, _tokenAmount, msg.value);

        // Transfer intial ether amount
        if (msg.value > 0) {
            _to.transfer(msg.value);
        }

        // Approve account to initialize
        super.approveAccount(_to);

        // Transfer intial token amount
        if (_tokenAmount > 0) {
          require(super._transfer(msg.sender, _to, _tokenAmount) == true);

          // Emit Standard ERC-20 event
          emit Transfer(msg.sender, _to, _tokenAmount);
        }
    }

}
