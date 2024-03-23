// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract RootStorage is Ownable(msg.sender) {
    
    struct Project  {
        string merkleRoot;
        mapping(address=>bool) isParticipating;
        address[] participantsList;
        
    }

    Project[] public projects;
    uint256 public projectCount;

    event ProjectAdded(uint256 indexed projectId, string merkleRoot);
    event MerkleRootUpdated(uint256 indexed projectId, string newMerkleRoot);
    event InterestRegistered(uint indexed projectId, address addr);

    function isRegistered(address _address, uint projectId) public view returns (bool) {
        return (projects[projectId].isParticipating[_address]);
    }

    // Function to add a new project's Merkle root, only callable by the contract owner
    function addProject(string memory merkleRoot) public onlyOwner {
        require(bytes(merkleRoot).length == 64, "Invalid Merkle root format");
        Project storage project=projects.push();
        project.merkleRoot=merkleRoot;
        emit ProjectAdded(projectCount, merkleRoot);
        projectCount++;
    }

    function registerInterest(uint256 projectId) public{
        require(projectId < projects.length, "Project ID does not exist");
        Project storage project=projects[projectId];

        require(!isRegistered(msg.sender,projectId));
        project.isParticipating[msg.sender]=true;
        project.participantsList.push(msg.sender);
        
        emit InterestRegistered(projectId,msg.sender);

    }


    // Function to update a project's Merkle root, only callable by the contract owner
    function updateProjectMerkleRoot(uint256 projectId, string memory merkleRoot) public onlyOwner {
        require(projectId < projectCount, "Project ID does not exist");
        projects[projectId].merkleRoot = merkleRoot;
        emit MerkleRootUpdated(projectId, merkleRoot);
    }

    // Function to retrieve a project's Merkle root by its ID
    function getProjectMerkleRoot(uint256 projectId) public view returns (string memory) {
        require(projectId < projectCount, "Project ID does not exist");
        return projects[projectId].merkleRoot;
    }

    // Function to get all Merkle roots
    function getAllMerkleRoots() public view returns (string[] memory) {
        string[] memory roots = new string[](projectCount);
        for (uint256 i = 0; i < projectCount; i++) {
            roots[i] = projects[i].merkleRoot;
        }
        return roots;
    }

    function getProjectParticipants(uint256 projectId) public view returns (address[] memory){
        return projects[projectId].participantsList;
    }
}