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
        bool success;
    }

    address public owner;
    IDrugIPToken public drugIPToken;
    Candidate[] public candidates;
    uint256 public lastProcessedIndex;

    // --- Events ---
    event CandidateQueued(uint256 indexed index, string smiles, string metadataURI);
    event UpkeepPerformed(uint256 indexed index, string smiles, string metadataURI);
    event MintFailed(uint256 indexed index, string smiles, string metadataURI);

    // --- Constructor ---
    constructor(address _tokenAddress) {
        require(_tokenAddress != address(0), "Invalid token address");
        owner = msg.sender;
        drugIPToken = IDrugIPToken(_tokenAddress);
    }

    // --- Modifiers ---
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    // --- Candidate Management ---
    function queueMolecule(string memory smiles, string memory metadataURI) public onlyOwner {
        candidates.push(Candidate({
            smiles: smiles,
            metadataURI: metadataURI,
            processed: false,
            success: false
        }));
        emit CandidateQueued(candidates.length - 1, smiles, metadataURI);
    }

    // --- Chainlink Automation Functions ---
    /**
     * @notice Chainlink Automation checkUpkeep function.
     *         Returns true if there is at least one unprocessed candidate.
     */
    function checkUpkeep(bytes calldata) external view override returns (bool upkeepNeeded, bytes memory performData) {
        for (uint256 i = lastProcessedIndex; i < candidates.length; i++) {
            if (!candidates[i].processed) {
                // Found a candidate to process
                return (true, abi.encode(i, candidates[i].smiles, candidates[i].metadataURI));
            }
        }
        return (false, bytes(""));
    }

    /**
     * @notice Chainlink Automation performUpkeep function.
     *         Mints a DrugIP token for the next unprocessed candidate.
     */
    function performUpkeep(bytes calldata performData) external override {
        (uint256 index, string memory smiles, string memory metadataURI) =
            abi.decode(performData, (uint256, string, string));
        require(index < candidates.length, "Invalid candidate index");
        require(!candidates[index].processed, "Already processed");

        // Attempt to mint the DrugIP token
        try drugIPToken.mintDrugIP(smiles, metadataURI) {
            candidates[index].processed = true;
            candidates[index].success = true;
            emit UpkeepPerformed(index, smiles, metadataURI);

            // Update lastProcessedIndex for efficiency
            if (index == lastProcessedIndex) {
                lastProcessedIndex++;
            }
        } catch {
            emit MintFailed(index, smiles, metadataURI);
            // Optionally, you could set a retry counter or mark as failed here
            candidates[index].processed = true;
        }
    }

    // --- Owner Functions ---
    function setDrugIPToken(address _tokenAddress) external onlyOwner {
        require(_tokenAddress != address(0), "Invalid token address");
        drugIPToken = IDrugIPToken(_tokenAddress);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Zero address");
        owner = newOwner;
    }

    // --- View Functions ---
    function candidatesCount() external view returns (uint256) {
        return candidates.length;
    }

    function getCandidate(uint256 index) external view returns (string memory, string memory, bool) {
        require(index < candidates.length, "Index out of bounds");
        Candidate storage c = candidates[index];
        return (c.smiles, c.metadataURI, c.processed);
    }
}