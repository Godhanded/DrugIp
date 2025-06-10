// DrugIPToken.sol - ERC1155 NFT contract
// Chain: Avalanche C-Chain (EVM Compatible)

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.27;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {ERC1155Burnable} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import {ERC1155Supply} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import {ERC1155URIStorage} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";

contract DrugIPToken is ERC1155, ERC1155Burnable, ERC1155Supply, ERC1155URIStorage {
    uint256 public tokenCounter;
    address public recieverAddress;
    mapping(bytes32 => bool) public moleculeHasBeenMinted;
    mapping(bytes32 => uint256) public moleculeToTokenId;
    mapping(address => bool) isOwner;

    event DrugIPMinted(uint256 indexed tokenId, string moleculeHash, string metadataURI);

    constructor(address initialOwner) ERC1155("") {
        isOwner[initialOwner] = true;
        recieverAddress = initialOwner;
        tokenCounter = 0;
    }

    modifier onlyOwner() {
        require(isOwner[msg.sender], "You are not the owner");
        _;
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function mint(address account, uint256 id, uint256 amount, bytes memory data) public onlyOwner {
        _mint(account, id, amount, data);
    }

    function mintDrugIP(string memory moleculeHash, string memory metadataURI) external onlyOwner returns (uint256) {
        bytes32 molHash = keccak256(abi.encodePacked(moleculeHash));
        require(!moleculeHasBeenMinted[molHash], "Molecule already tokenized");

        _mint(recieverAddress, tokenCounter, 1, "");
        _setURI(tokenCounter, metadataURI);

        moleculeHasBeenMinted[molHash] = true;
        moleculeToTokenId[molHash] = tokenCounter;

        emit DrugIPMinted(tokenCounter, moleculeHash, metadataURI);
        tokenCounter++;
        return tokenCounter - 1;
    }

    function uri(uint256 tokenId) public view virtual override(ERC1155, ERC1155URIStorage) returns (string memory) {
        return super.uri(tokenId);
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        onlyOwner
    {
        _mintBatch(to, ids, amounts, data);
    }

    // The following functions are overrides required by Solidity.

    function _update(address from, address to, uint256[] memory ids, uint256[] memory values)
        internal
        override(ERC1155, ERC1155Supply)
    {
        super._update(from, to, ids, values);
    }

    function addOwner(address _newOwner) external onlyOwner {
        isOwner[_newOwner] = true;
    }

    function changReceiver(address _receiver) external onlyOwner {
        recieverAddress = _receiver;
    }
}

// contract DrugIPToken is ERC721, ERC721URIStorage, Ownable {
//     uint256 public tokenCounter;
//     mapping(bytes32 => bool) public moleculeHasBeenMinted;

//     event DrugIPMinted(uint256 indexed tokenId, string moleculeHash, string metadataURI);

//     constructor(address _owner)
//         ERC721("DrugIPToken", "DRGIP")
//         Ownable(_owner) {

//         tokenCounter = 0;
//     }

//     function tokenURI(uint256 tokenId)
//         public
//         view
//         override(ERC721, ERC721URIStorage)
//         returns (string memory)
//     {
//         return super.tokenURI(tokenId);
//     }

//     function supportsInterface(bytes4 interfaceId)
//         public
//         view
//         override(ERC721, ERC721URIStorage)
//         returns (bool)
//     {
//         return super.supportsInterface(interfaceId);
//     }
// }
