// DrugIPToken.sol - ERC721 NFT contract
// Chain: Avalanche C-Chain (EVM Compatible)

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract DrugIPToken is ERC721, ERC721URIStorage, Ownable {
    uint256 public tokenCounter;
    mapping(bytes32 => bool) public moleculeHasBeenMinted;

    event DrugIPMinted(uint256 indexed tokenId, string moleculeHash, string metadataURI);

    constructor(address _owner) 
        ERC721("DrugIPToken", "DRGIP") 
        Ownable(_owner) {

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

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

