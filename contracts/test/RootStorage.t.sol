// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "../src/RootStorage.sol";
import "forge-std/Test.sol";
import "forge-std/console.sol";




contract RootStorageTest is Test,RootStorage{
    RootStorage public rootStorage;
    
    string[] expectedRoots = [
        "0x1f5ef9ffe259f05968e28dcdba2ceb2bc56d4af13dc54b198db979914891e632",
        "0x2f5ef9ffe259f05968e28dcdba2ceb2bc56d4af13dc54b198db979914891e632",
        "0x3f5ef9ffe259f05968e28dcdba2ceb2bc56d4af13dc54b198db979914891e632",
        "0x4f5ef9ffe259f05968e28dcdba2ceb2bc56d4af13dc54b198db979914891e632",
        "0x5f5ef9ffe259f05968e28dcdba2ceb2bc56d4af13dc54b198db979914891e632"
    ];

    
    
    function setUp() public {
    rootStorage= new RootStorage();
    rootStorage.addProject("0x1f5ef9ffe259f05968e28dcdba2ceb2bc56d4af13dc54b198db979914891e632");
    rootStorage.addProject("0x2f5ef9ffe259f05968e28dcdba2ceb2bc56d4af13dc54b198db979914891e632");
    rootStorage.addProject("0x3f5ef9ffe259f05968e28dcdba2ceb2bc56d4af13dc54b198db979914891e632");
    rootStorage.addProject("0x4f5ef9ffe259f05968e28dcdba2ceb2bc56d4af13dc54b198db979914891e632");
    rootStorage.addProject("0x5f5ef9ffe259f05968e28dcdba2ceb2bc56d4af13dc54b198db979914891e632");
    
    }

    function test_ProjectRoot() public view {
         assertEq(rootStorage.getProjectMerkleRoot(0),"0x1f5ef9ffe259f05968e28dcdba2ceb2bc56d4af13dc54b198db979914891e632");
    } 

    function test_RootFormat() public {
        vm.expectRevert("Invalid Merkle root format");
        rootStorage.addProject("0x1f5ef9ffe259f05968e28dcdba");

    }

    function test_OnlyOwnerAddProject() public{
        vm.prank(address(0x123));
        vm.expectRevert();
        rootStorage.addProject("0x6f5ef9ffe259f05968e28dcdba2ceb2bc56d4af13dc54b198db979914891e632");
        vm.stopPrank();

        }

    function test_RegisterInterest() public {
        vm.prank(address(0x123));
        rootStorage.registerInterest(0);
        console.log(rootStorage.projects(0)); 
        assertTrue(rootStorage.isRegistered(address(0x123),0),"address should be marked as participating");

    }

    // function test_RegisterInterestWithStorage() public {
    //     vm.prank(address(0x123));
    //     rootStorage.registerInterest(0);
    //     bool isParticipatant= rootStorage.projects(0).isParticipating[address(0x123)];
    //     //rootStorage.projects(0) is a string
    //     assertTrue(isParticipatant,"address should be marked as participating");

    // }

     
    function test_MultiProjectRoot() public view{
    assertEq(rootStorage.getProjectMerkleRoot(1),"0x2f5ef9ffe259f05968e28dcdba2ceb2bc56d4af13dc54b198db979914891e632");
    assertEq(rootStorage.getProjectMerkleRoot(2),"0x3f5ef9ffe259f05968e28dcdba2ceb2bc56d4af13dc54b198db979914891e632");
    assertEq(rootStorage.getProjectMerkleRoot(3),"0x4f5ef9ffe259f05968e28dcdba2ceb2bc56d4af13dc54b198db979914891e632");
    assertEq(rootStorage.getProjectMerkleRoot(4),"0x5f5ef9ffe259f05968e28dcdba2ceb2bc56d4af13dc54b198db979914891e632");
    } 


    function test_Get_ProjectCount() public view {
        assertEq(rootStorage.projectCount(),5);
            } 

    function test_Get_All_Roots() public view {
     string[] memory allRoots = rootStorage.getAllMerkleRoots();

        for (uint256 i = 0; i < allRoots.length; i++) {
        assertEq(keccak256(bytes(allRoots[i])), keccak256(bytes(expectedRoots[i])));
        }

    } 
    

}

