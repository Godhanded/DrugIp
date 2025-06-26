// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {DrugIPToken} from "../src/DrugIp.sol";
import {DrugIPUpkeep} from "../src/DrugIPUpkeep.sol";
import {EnableSepFuji} from "./testccip.s.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";

contract DrugIPAvanlanche is Script {
    DrugIPToken public drugIPToken;
    DrugIPToken public drugIPTokenEth;
    DrugIPUpkeep public drugIPUpkeep;

    address ccipRouterAddress = 0xF694E193200268f9a4868e4Aa017A0118C9a8177;
    address linkTokenAddress = 0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846;
    uint64 currentChainSelector = 14767482510784806043; // Avalanche Fuji Chain Selector

    function setUp() public {}

    function run() public {
        vm.createSelectFork("fuji");
        vm.startBroadcast();
        console.log(msg.sender);

        drugIPToken = new DrugIPToken(msg.sender, ccipRouterAddress, linkTokenAddress, currentChainSelector);
        drugIPUpkeep = new DrugIPUpkeep(address(drugIPToken));

        console.log("Adding Upkeep owner..........");
        drugIPToken.addOwner(address(drugIPUpkeep));

        console.log("DrugToken address: ", address(drugIPToken));
        console.log("DrugIPUpkeep address: ", address(drugIPUpkeep));

        vm.stopBroadcast();

        vm.createSelectFork("sepolia");
        vm.startBroadcast();
        console.log(msg.sender);
        console.log("Deploying on Sepolia......");

        drugIPTokenEth = new DrugIPToken(
            msg.sender,
            0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59,
            0x779877A7B0D9E8603169DdbD7836e478b4624789,
            16015286601757825753
        );

        console.log("DrugTokenSepoilaEth address: ", address(drugIPTokenEth));

        drugIPTokenEth.enableChain(14767482510784806043, address(drugIPToken), encode(200_000));
        vm.stopBroadcast();

        // vm.createSelectFork("fuji");
        // vm.startBroadcast();
        // drugIPToken.enableChain(16015286601757825753, address(drugIPTokenEth), encode(200_000));
        // vm.stopBroadcast();
    }

    function encode(uint256 gasLimit) public pure returns (bytes memory extraArgsBytes) {
        Client.EVMExtraArgsV1 memory extraArgs = Client.EVMExtraArgsV1({gasLimit: gasLimit});
        extraArgsBytes = Client._argsToBytes(extraArgs);
    }
}

contract DrugIPSepoilaEth is Script {
    DrugIPToken public drugIPToken;

    address ccipRouterAddress = 0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59;
    address linkTokenAddress = 0x779877A7B0D9E8603169DdbD7836e478b4624789;
    uint64 currentChainSelector = 16015286601757825753; // Eth Sepoila Chain Selector

    function setUp() public {}

    function run() public {
        vm.startBroadcast();
        console.log(msg.sender);

        drugIPToken = new DrugIPToken(msg.sender, ccipRouterAddress, linkTokenAddress, currentChainSelector);

        console.log("DrugTokenSepoilaEth address: ", address(drugIPToken));

        vm.stopBroadcast();
    }
}
