pragma solidity ^0.4.25 ;
import "./TestERTTokenV2.sol";
import "./TestBurn.sol";
import "./TestMint.sol";


contract TestERTTokenV3 is TestERTTokenV2, TestBurn, TestMint {

    constructor()  TestERTTokenV2()  public{
    }

}


