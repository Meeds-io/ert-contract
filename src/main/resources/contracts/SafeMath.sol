pragma solidity ^0.4.25 ;

contract SafeMath {
    constructor() internal{
    }

    function safeAdd(uint256 x, uint256 y) internal pure returns(uint256){
        uint256 z = x + y;
        assert((z >= x) && (z >= y));
        return z;
    }

    function safeSubtract(uint256 x, uint256 y) internal pure returns(uint256){
        assert(x >= y);
        uint256 z = x - y;
        return z;
    }

    function safeMult(uint256 x, uint256 y) internal pure returns(uint256){
        uint256 z = x * y;
        assert((x == 0)||(z/x == y));
        return z;
    }
}
