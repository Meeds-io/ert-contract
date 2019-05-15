pragma solidity ^0.4.25 ;
import "../Owned.sol";
import "./TestDataAccess.sol";

contract TestAccountFreeze is Owned, TestDataAccess{

    event FrozenAccount(address target);
    event UnFrozenAccount(address target);

    constructor() internal{
    }

    function freeze(address _target) public onlyOwner{
        if (!super.isFrozen(_target)) {
            super._setFrozenAccount(_target, true);
            emit FrozenAccount(_target);
        }
    }

    function unFreeze(address _target) public onlyOwner{
        if (super.isFrozen(_target)) {
            super._setFrozenAccount(_target, false);
            emit UnFrozenAccount(_target);
        }
    }

    function isFrozen(address _target) public view returns (bool){
        return super.isFrozen(_target);
    }

    modifier whenNotFrozen(){
        // TODO *********** Check on sender and receiver
        // ************ If this implementation will be used
        require (!super.isFrozen(msg.sender));
        _;
    }

}


