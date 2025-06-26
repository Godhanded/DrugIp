// DrugIPToken.sol - ERC1155 NFT, Automation and CCIP compatible contract
// Chain: Avalanche C-Chain (EVM Compatible)

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.27;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {ERC1155Burnable} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import {ERC1155Supply} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import {ERC1155URIStorage} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";

import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {IAny2EVMMessageReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IAny2EVMMessageReceiver.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";

contract DrugIPToken is ERC1155, ERC1155Burnable, ERC1155Supply, ERC1155URIStorage, CCIPReceiver {
    error OnlyOnAvalancheFuji();
    error SenderNotEnabled(address sender);
    error ChainNotEnabled(uint64 chainSelector);
    error OperationNotAllowedOnCurrentChain(uint64 chainSelector);
    error NotEnoughBalanceForFees(uint256 currentBalance, uint256 calculatedFees);

    enum PayFeesIn {
        Native,
        LINK
    }

    struct DrugNftDetails {
        address drugNftAddress;
        bytes ccipExtraArgsBytes;
    }

    uint64 private immutable i_currentChainSelector;
    LinkTokenInterface internal immutable i_linkToken;

    uint256 public s_tokenCounter;
    address public s_recieverAddress;
    mapping(address => bool) s_isOwner;
    mapping(bytes32 => bool) public s_moleculeHasBeenMinted;
    mapping(bytes32 => uint256) public s_moleculeToTokenId;
    mapping(uint256 => bool) public s_tokenIdMinted;
    mapping(uint64 destChainSelector => DrugNftDetails drugNftDetailsPerChain) public s_chains;

    uint256 constant AVALANCHE_FUJI_CHAIN_ID = 43113;

    event DrugIPMinted(uint256 indexed tokenId, string moleculeHash, string metadataURI);
    event ChainEnabled(uint64 chainSelector, address drugNftAddress, bytes ccipExtraArgs);
    event ChainDisabled(uint64 chainSelector);
    event CrossChainSent(
        address from,
        address to,
        uint256 tokenId,
        uint256 value,
        uint64 sourceChainSelector,
        uint64 destinationChainSelector
    );
    event CrossChainReceived(
        address from,
        address to,
        uint256 tokenId,
        uint256 id,
        uint64 sourceChainSelector,
        uint64 destinationChainSelector
    );

    constructor(address initialOwner, address ccipRouterAddress, address linkTokenAddress, uint64 currentChainSelector)
        ERC1155("")
        CCIPReceiver(ccipRouterAddress)
    {
        if (ccipRouterAddress == address(0)) revert InvalidRouter(address(0));
        i_linkToken = LinkTokenInterface(linkTokenAddress);
        i_currentChainSelector = currentChainSelector;

        s_isOwner[initialOwner] = true;
        s_recieverAddress = initialOwner;
        s_tokenCounter = 0;
    }

    modifier onlyOwner() {
        require(s_isOwner[msg.sender], string(abi.encodePacked("You are not the owner ", msg.sender)));
        _;
    }

    modifier onlyOnAvalanchFuji() {
        if (block.chainid != AVALANCHE_FUJI_CHAIN_ID) {
            revert OnlyOnAvalancheFuji();
        }
        _;
    }

    modifier onlyEnabledChain(uint64 _chainSelector) {
        if (s_chains[_chainSelector].drugNftAddress == address(0)) {
            revert ChainNotEnabled(_chainSelector);
        }
        _;
    }

    modifier onlyEnabledSender(uint64 _chainSelector, address _sender) {
        if (s_chains[_chainSelector].drugNftAddress != _sender) {
            revert SenderNotEnabled(_sender);
        }
        _;
    }

    modifier onlyOtherChains(uint64 _chainSelector) {
        if (_chainSelector == i_currentChainSelector) {
            revert OperationNotAllowedOnCurrentChain(_chainSelector);
        }
        _;
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function mint(address account, uint256 id, uint256 amount, bytes memory data) public onlyOwner onlyOnAvalanchFuji {
        require(s_tokenIdMinted[id], "A corresponding drug molecule token must have already been minted for this id");
        _mint(account, id, amount, data);
    }

    function mintDrugIP(string memory moleculeHash, string memory metadataURI)
        external
        onlyOwner
        onlyOnAvalanchFuji
        returns (uint256)
    {
        bytes32 molHash = keccak256(abi.encodePacked(moleculeHash));
        // require(!s_moleculeHasBeenMinted[molHash], "Molecule already tokenized");

        _mint(s_recieverAddress, s_tokenCounter, 1, "");
        _setURI(s_tokenCounter, metadataURI);

        s_moleculeHasBeenMinted[molHash] = true;
        s_moleculeToTokenId[molHash] = s_tokenCounter;
        s_tokenIdMinted[s_tokenCounter] = true;

        emit DrugIPMinted(s_tokenCounter, moleculeHash, metadataURI);
        s_tokenCounter++;
        return s_tokenCounter - 1;
    }

    function ccSafeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 value,
        bytes memory data,
        uint64 destinationChainSelector,
        PayFeesIn payFeesIn
    ) external payable onlyEnabledChain(destinationChainSelector) returns (bytes32 messageId) {
        string memory tokenUri = uri(id);
        burn(from, id, value);

        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(s_chains[destinationChainSelector].drugNftAddress),
            data: abi.encode(from, to, id, value, data, tokenUri),
            tokenAmounts: new Client.EVMTokenAmount[](0),
            extraArgs: s_chains[destinationChainSelector].ccipExtraArgsBytes,
            feeToken: payFeesIn == PayFeesIn.LINK ? address(i_linkToken) : address(0)
        });

        IRouterClient router = IRouterClient(this.getRouter());
        uint256 fees = router.getFee(destinationChainSelector, message);

        if (payFeesIn == PayFeesIn.LINK) {
            if (fees > i_linkToken.balanceOf(from)) {
                revert NotEnoughBalanceForFees(i_linkToken.balanceOf(from), fees);
            }

            // Approve the Router to transfer LINK tokens on contract's behalf. It will spend the fees in LINK
            i_linkToken.transferFrom(from, address(this), fees);
            i_linkToken.approve(address(i_ccipRouter), fees);

            // Send the message through the router and store the returned message ID
            messageId = router.ccipSend(destinationChainSelector, message);
        } else {
            if (fees > msg.value) {
                revert NotEnoughBalanceForFees(msg.value, fees);
            }

            // Send the message through the router and store the returned message ID
            messageId = router.ccipSend{value: fees}(destinationChainSelector, message);
        }
        emit CrossChainSent(from, to, id, value, i_currentChainSelector, destinationChainSelector);
    }

    function _ccipReceive(Client.Any2EVMMessage memory message)
        internal
        virtual
        override
        onlyEnabledChain(message.sourceChainSelector)
        onlyEnabledSender(message.sourceChainSelector, abi.decode(message.sender, (address)))
    {
        uint64 sourceChainSelector = message.sourceChainSelector;
        (address from, address to, uint256 id, uint256 value, bytes memory data, string memory tokenUri) =
            abi.decode(message.data, (address, address, uint256, uint256, bytes, string));

        _mint(to, id, value, data);
        if (keccak256(bytes(uri(id))) == keccak256(bytes(""))) {
            _setURI(id, tokenUri);
        }

        emit CrossChainReceived(from, to, id, value, sourceChainSelector, i_currentChainSelector);
    }

    function uri(uint256 tokenId) public view virtual override(ERC1155, ERC1155URIStorage) returns (string memory) {
        return super.uri(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(CCIPReceiver, ERC1155) returns (bool) {
        return interfaceId == type(IAny2EVMMessageReceiver).interfaceId || super.supportsInterface(interfaceId);
    }

    function enableChain(uint64 chainSelector, address drugNftAddress, bytes memory ccipExtraArgs)
        external
        onlyOwner
        onlyOtherChains(chainSelector)
    {
        s_chains[chainSelector] = DrugNftDetails({drugNftAddress: drugNftAddress, ccipExtraArgsBytes: ccipExtraArgs});

        emit ChainEnabled(chainSelector, drugNftAddress, ccipExtraArgs);
    }

    function disableChain(uint64 chainSelector) external onlyOwner onlyOtherChains(chainSelector) {
        delete s_chains[chainSelector];

        emit ChainDisabled(chainSelector);
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        onlyOwner
        onlyOnAvalanchFuji
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
        s_isOwner[_newOwner] = true;
    }

    function changReceiver(address _receiver) external onlyOwner {
        s_recieverAddress = _receiver;
    }

    function getCCIPRouter() public view returns (address) {
        return address(i_ccipRouter);
    }
}
