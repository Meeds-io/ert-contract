pragma solidity ^0.4.25 ;
import "./Owned.sol";
import "./ERTTokenDataV1.sol";
import "./ERTTokenDataV2.sol";

/**
 * @title DataAccess.sol
 * @dev This contract will allow to access data using ERTTokenDataV1
 * Only current contract will be able to change data in ERTTokenData using restriction
 * added by contract DataOwned.sol where dataOwner = either current contract address or
 * proxy contract address.
 */
contract DataAccess is Owned{

    /**
     * @dev Made internal because this contract is abstract
     */
    constructor() internal{
    }

    // View methods

    /**
     * @dev Check if the Token implementation has been initialized once
     * @return true if the Token contract has bee initialized
     */
    function initialized() public view returns(bool){
        return ERTTokenDataV1(dataAddresses_[1]).initialized();
    }

    /**
     * @return ERC20 Token name
     */
    function name() public view returns(string memory){
        return ERTTokenDataV1(dataAddresses_[1]).name();
    }

    /**
     * @return ERC20 Token symbol
     */
    function symbol() public view returns(string memory){
        return ERTTokenDataV1(dataAddresses_[1]).symbol();
    }

    /**
     * @return ERC20 tokens total supply
     */
    function totalSupply() public view returns(uint256){
        return ERTTokenDataV1(dataAddresses_[1]).totalSupply();
    }

    /**
     * @return ERC20 tokens decimals
     */
    function decimals() public view returns(uint8){
        return ERTTokenDataV1(dataAddresses_[1]).decimals();
    }

    /**
     * @dev Token sell price in WEI
     * @return amount Token selling price in WEI
     */
    function getSellPrice() public view returns(uint256){
        return ERTTokenDataV1(dataAddresses_[1]).getSellPrice();
    }

    /**
     * @return true if the address has been already initialized before
     */
    function isInitializedAccount(address _target) public view returns(bool){
        return ERTTokenDataV2(dataAddresses_[2]).isInitializedAccount(_target);
    }

    /**
     * @return reward balance of an address
     */
    function rewardBalanceOf(address _target) public view returns(uint256){
        return ERTTokenDataV2(dataAddresses_[2]).rewardBalanceOf(_target);
    }

    /**
     * @return vested balance of an address
     */
    function vestingBalanceOf(address _target) public view returns(uint256){
        return ERTTokenDataV2(dataAddresses_[2]).vestingBalanceOf(_target);
    }

    // Public owner write methods

    /**
     * @dev set the name of ERC20 Token (only contract owner can set it)
     * @param _name name of ERC20 Token
     */
    function setName(string memory _name) public onlyOwner{
        ERTTokenDataV1(dataAddresses_[1]).setName(_name);
    }

    /**
     * @dev sets the ERC20 symbol (only contract owner can set it)
     * @param _symbol symbol to use for ERC20 Contract
     */
    function setSymbol(string memory _symbol) public onlyOwner{
        ERTTokenDataV1(dataAddresses_[1]).setSymbol(_symbol);
    }

    // Internal write methods

    /**
     * @dev Mark Token as initialized. This is used only once all the duration of ERC20 Token,
     * thus it's stored in data contract.
     */
    function _setInitialized() internal{
        ERTTokenDataV1(dataAddresses_[1]).setInitialized();
    }

    /**
     * @dev mark ERC20 as paused or not. If paused, the ERC20 operations will be frozen until
     * the contract gets un-paused.
     */
    function _setPaused(bool _paused) internal{
        ERTTokenDataV1(dataAddresses_[1]).setPaused(_paused);
    }

    /**
     * @dev Sets the total supply of Tokens. This must be used only internally.
     * @param _totalSupply amount of total supply
     */
    function _setTotalSupply(uint256 _totalSupply) internal{
        ERTTokenDataV1(dataAddresses_[1]).setTotalSupply(_totalSupply);
    }

    /**
     * @dev Sets the decimals to use in ERC20 contract
     * @param _decimals number of decimals
     */
    function _setDecimals(uint8 _decimals) internal{
        ERTTokenDataV1(dataAddresses_[1]).setDecimals(_decimals);
    }

    /**
     * @dev Change the affected tokens balance for the given address
     * @param _target addres to change its tokens balance
     * @param _balance new tokens amount affected to address
     */
    function _setBalance(address _target, uint256 _balance) internal{
        ERTTokenDataV1(dataAddresses_[1]).setBalance(_target, _balance);
    }

    /**
     * @dev Sets the tokens amount that an address can spend on behalf of
     * another address.
     * @param _account address from which the tokens can be spent
     * @param _spender address of the potentiel spender
     * @param _allowance the amount of allowed tokens to spend
     */
    function _setAllowance(address _account, address _spender, uint256 _allowance) internal{
        ERTTokenDataV1(dataAddresses_[1]).setAllowance(_account, _spender, _allowance);
    }

    /**
     * @dev Sets an account as approved or disapproved to receive and to send ERC20 tokens
     * @param _target address of the account to approve/disapprove
     * @param _approved true if it's about approving the account, else false
     */
    function _setApprovedAccount(address _target, bool _approved) internal{
        ERTTokenDataV1(dataAddresses_[1]).setApprovedAccount(_target, _approved);
    }

    /**
     * @dev Sets the equivalent of 1 gas in term of ERC20 tokens.
     * @param _value amount of tokens representing 1 gas
     */
    function _setSellPrice(uint256 _value) internal{
        ERTTokenDataV1(dataAddresses_[1]).setSellPrice(_value);
    }

    /**
     * @dev sets an address as admin of the contract with a specified habilitation
     * level. If _level == 0 , the address will not be admin anymore
     * @param _target address to be used
     * @param _level habilitation level
     */
    function _setAdmin(address _target, uint8 _level) internal {
        ERTTokenDataV1(dataAddresses_[1]).setAdmin(_target, _level);
    }

    /**
     * @dev Check if the specified address is an admin with the habilitation level
     * @param _target account address
     * @param _level habilitation level
     * @return true if address is recognized as admin
     */
    function _isAdmin(address _target, uint8 _level) internal view returns(bool){
        return ERTTokenDataV1(dataAddresses_[1]).isAdmin(_target, _level);
    }

    /**
     * @dev Check if the specified address is an admin with the habilitation level
     * @param _target account address
     * @return habilitation level
     */
    function _getAdminLevel(address _target) internal view returns(uint8){
        return ERTTokenDataV1(dataAddresses_[1]).getAdminLevel(_target);
    }

    /**
     * @dev Check if ERC20 operations are frozen for all accounts or not
     * @return true if ERC20 operations are paused
     */
    function _isPaused() internal view returns (bool){
        return ERTTokenDataV1(dataAddresses_[1]).isPaused();
    }

    /**
     * @return true if account is allowed to receive and send tokens
     */
    function _isApprovedAccount(address _target) internal view returns(bool){
        return ERTTokenDataV1(dataAddresses_[1]).isApprovedAccount(_target);
    }

    /**
     * @return ERC20 tokens balance of an address
     */
    function _balanceOf(address _target) internal view returns(uint256){
        return ERTTokenDataV1(dataAddresses_[1]).balance(_target);
    }


    /**
     * @return ERC20 tokens allowance from an account to another spender account
     */
    function _getAllowance(address _account, address _spender) internal view returns (uint256){
        return ERTTokenDataV1(dataAddresses_[1]).getAllowance(_account, _spender);
    }

    /**
     * @dev Change the affected reward balance for the given address
     * @param _target addres to change its reward balance
     * @param _balance new reward balance affected to address
     */
    function _setRewardBalance(address _target, uint256 _balance) internal{
        ERTTokenDataV2(dataAddresses_[2]).setRewardBalance(_target, _balance);
    }

    /**
     * @dev Change the affected vested balance for the given address
     * @param _target addres to change its vested balance
     * @param _balance new vested balance affected to address
     */
    function _setVestingBalance(address _target, uint256 _balance) internal{
        ERTTokenDataV2(dataAddresses_[2]).setVestingBalance(_target, _balance);
    }

    /**
     * @dev mark address as initialized
     * @param _target addres to mark as initialized
     */
    function _setInitializedAccount(address _target) internal{
        ERTTokenDataV2(dataAddresses_[2]).setInitializedAccount(_target);
    }

}
