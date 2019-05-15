pragma solidity ^0.4.25 ;
import "../ERC20Abstract.sol";
import "../Owned.sol";

contract TestMint is Owned,  ERC20Abstract{

    event MintedToken(address minter, address target, uint256 mintedAmount);

    constructor() internal{
    }

    function mintToken(address _target, uint256 _mintedAmount) public onlyOwner{
        require(_mintedAmount > 0);
        super._setBalance(_target, super.safeAdd(super._balanceOf(_target), _mintedAmount));
        uint256 totalSupply = super.totalSupply();
        require(totalSupply + _mintedAmount > totalSupply);
        super._setTotalSupply(totalSupply + _mintedAmount);
        emit Transfer(address(0), owner, _mintedAmount);
        emit Transfer(owner, _target, _mintedAmount);
        emit MintedToken(msg.sender, _target, _mintedAmount);
    }
}
