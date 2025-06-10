// DrugIPUpkeep.sol - Chainlink Automation-compatible wrapper
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AutomationCompatibleInterface} from
    "@chainlink/contracts/src/v0.8/automation/interfaces/AutomationCompatibleInterface.sol";

interface IDrugIPToken {
    function mintDrugIP(string memory moleculeHash, string memory metadataURI) external returns (uint256);
}

contract DrugIPUpkeep is AutomationCompatibleInterface {
    struct Candidate {
        string smiles;
        string metadataURI;
        bool processed;
    }

    address public owner;
    IDrugIPToken public drugIPToken;
    Candidate[] public candidates;

    constructor(address _tokenAddress) {
        owner = msg.sender;
        drugIPToken = IDrugIPToken(_tokenAddress);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function queueMolecule(string memory smiles, string memory metadataURI) public onlyOwner {
        candidates.push(Candidate({smiles: smiles, metadataURI: metadataURI, processed: false}));
    }

    function checkUpkeep(bytes calldata) external view returns (bool upkeepNeeded, bytes memory performData) {
        for (uint256 i = 0; i < candidates.length; i++) {
            if (!candidates[i].processed) {
                return (true, abi.encode(i, candidates[i].smiles, candidates[i].metadataURI));
            }
        }
        return (false, bytes(""));
    }

    function performUpkeep(bytes calldata performData) external {
        (uint256 index, string memory smiles, string memory metadataURI) =
            abi.decode(performData, (uint256, string, string));
        require(!candidates[index].processed, "Already processed");

        drugIPToken.mintDrugIP(smiles, metadataURI);
        candidates[index].processed = true;
    }
}
