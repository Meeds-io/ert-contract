pragma solidity ^0.4.25 ;
import "../Owned.sol";
import "../DataAccess.sol";
import "../SafeMath.sol";


contract TestBurn is Owned, DataAccess, SafeMath{

    event Burn(address burner, uint256 value);

    constructor() internal{
    }

    function burn(uint256 _value) public onlyOwner{
        uint256 ownerBalance = super._balanceOf(msg.sender);
        require(ownerBalance >= _value);
        super._setBalance(msg.sender, super.safeSubtract(ownerBalance, _value));
        super._setTotalSupply(super.safeSubtract(super.totalSupply(), _value));
        emit Burn(msg.sender, _value);
    }

}
