pragma solidity ^0.4.25  ;
import "./Admin.sol";
import "./ERC20Abstract.sol";

/**
 * @title GasPayableInToken.sol
 * @dev An abstract contract to pay gas using ether collected on contract
 * instead of letting users pay the transaction fee
 */
contract GasPayableInToken is Admin, ERC20Abstract {

    // Event emitted when the owner changes the token price
    event TokenPriceChanged(uint256 tokenPrice);
    // Event emitted when the transaction fee is payed by contract ether balance
    event TransactionFee(address from, uint tokenFee, uint etherFeeRefund);
    // Event emitted when the contract doesn't have enough founds to pay gas
    event NoSufficientFund(uint balance);

    /**
     * @dev Made internal because this contract is abstract
     */
    constructor () internal {
    }

    /**
     * @dev Set the token sell price in ether and calculate consequetly the gas price in
     * tokens. (determine the amount tokens for 1 gas)
     * @param _value the amount of 1 token price in WEI
     */
    function setSellPrice(uint256 _value) public onlyAdmin(5) {
        require(_value != 0);
        super._setSellPrice(_value);
        emit TokenPriceChanged(_value);
    }

    /**
     * @dev Pay transaction fee from contract ether balance and deducts the equivalent in tokens
     * from issuer tokens balance.
     * @param _gasLimit gas limit of transaction, used to calculate used gas
     */
    function _payGasInToken(uint256 _gasLimit) internal {
        // Unnecessary to transfer Tokens from Owner to himself
        if (msg.sender == owner) {
            return;
        }
        uint256 tokenSellPrice = super.getSellPrice();
        if (tokenSellPrice == 0) {
            return;
        }

        // Used gas until this instruction + a fixed gas
        // that will be used to finish the transaction
        uint256 gasUsed = _gasLimit - gasleft() + 66903;
        uint256 etherFeeRefund = gasUsed * tx.gasprice;
        uint256 tokenFeeAmount = super.safeMult(etherFeeRefund, (10 ** (uint(super.decimals())))) / tokenSellPrice;
        uint256 contractBalance = address(this).balance;
        if (etherFeeRefund > contractBalance) {
            // No sufficient funds on contract, thus the issuer will pay gas by himself using his ether
            // and not tokens
            emit NoSufficientFund(contractBalance);
        } else if (super._balanceOf(msg.sender) > tokenFeeAmount) {
            // Transfer Tokens from sender to contract owner
            require(super._transfer(msg.sender, owner, tokenFeeAmount) == true);
            // Transfer equivalent ether balance from contract to sender
            msg.sender.transfer(etherFeeRefund);
            emit TransactionFee(msg.sender, tokenFeeAmount, etherFeeRefund);
        }
    }
}
