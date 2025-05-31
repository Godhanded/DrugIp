// DrugIPToken.sol - ERC721 NFT contract
// Chain: Avalanche C-Chain (EVM Compatible)

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DrugIPToken is ERC721URIStorage, Ownable {
    uint256 public tokenCounter;
    mapping(bytes32 => bool) public moleculeHasBeenMinted;

    event DrugIPMinted(uint256 indexed tokenId, string moleculeHash, string metadataURI);

    constructor() ERC721("DrugIPToken", "DRGIP") Ownable(msg.sender) {
        tokenCounter = 0;
    }

    function mintDrugIP(string memory moleculeHash, string memory metadataURI) external onlyOwner returns (uint256) {
        bytes32 molHash = keccak256(abi.encodePacked(moleculeHash));
        require(!moleculeHasBeenMinted[molHash], "Molecule already tokenized");

        uint256 newTokenId = tokenCounter;
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, metadataURI);

        moleculeHasBeenMinted[molHash] = true;
        tokenCounter++;

        emit DrugIPMinted(newTokenId, moleculeHash, metadataURI);
        return newTokenId;
    }
}

// DrugIPUpkeep.sol - Chainlink Automation-compatible wrapper

pragma solidity ^0.8.20;

interface IDrugIPToken {
    function mintDrugIP(string memory moleculeHash, string memory metadataURI) external returns (uint256);
}

contract DrugIPUpkeep {
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
        candidates.push(Candidate({
            smiles: smiles,
            metadataURI: metadataURI,
            processed: false
        }));
    }

    function checkUpkeep(bytes calldata) external view returns (bool upkeepNeeded, bytes memory performData) {
        for (uint i = 0; i < candidates.length; i++) {
            if (!candidates[i].processed) {
                return (true, abi.encode(i, candidates[i].smiles, candidates[i].metadataURI));
            }
        }
        return (false, bytes(""));
    }

    function performUpkeep(bytes calldata performData) external {
        (uint index, string memory smiles, string memory metadataURI) = abi.decode(performData, (uint, string, string));
        require(!candidates[index].processed, "Already processed");

        drugIPToken.mintDrugIP(smiles, metadataURI);
        candidates[index].processed = true;
    }
}