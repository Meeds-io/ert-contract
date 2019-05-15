pragma solidity ^0.4.25 ;
import "./TestTokenNewVersion.sol";
import "./TestBurn.sol";
import "./TestMint.sol";


contract TestTokenNewerVersion is TestTokenNewVersion, TestBurn, TestMint {

    constructor()  public{
    }

}