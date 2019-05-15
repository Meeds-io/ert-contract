pragma solidity ^0.4.25 ;
import "../TokenStorage.sol";
import "./TestERTTokenNewDataVersion.sol";


contract TestDataAccess is TokenStorage{

    constructor() internal{
    }

    function isFrozen(address _target) public view returns(bool){
        address dataAddress = super.getDataAddress(3);
        require(dataAddress != address(0));
        return TestERTTokenNewDataVersion(dataAddress).isFrozen(_target);
    }

    function _setFrozenAccount(address _target, bool frozen) internal{
        address dataAddress = super.getDataAddress(3);
        require(dataAddress != address(0));
        TestERTTokenNewDataVersion(dataAddress).setFrozenAccount(_target, frozen);
    }
}
