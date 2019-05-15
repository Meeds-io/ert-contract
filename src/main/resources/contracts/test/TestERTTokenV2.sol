pragma solidity ^0.4.25 ;
import "../ERTTokenV1.sol";
import "./TestAccountFreeze.sol";
import "./TestDataAccess.sol";

contract TestERTTokenV2 is ERTTokenV1, TestDataAccess, TestAccountFreeze{

    constructor() ERTTokenV1() public{
    }

    function transfer(address _to, uint256 _value) public whenNotFrozen returns (bool success){
        return super.transfer(_to, _value);
    }

    function approve(address _spender, uint256 _value) public whenNotFrozen returns (bool success){
        return super.approve(_spender, _value);
    }

    function transferFrom(address _from, address _to, uint256 _value) public whenNotFrozen returns (bool success){
        return super.transferFrom(_from, _to, _value);
    }
}


