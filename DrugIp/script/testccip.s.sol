// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {DrugIPToken} from "../src/DrugIp.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";

contract EnableFujiSep is Script {
    DrugIPToken public drugIPToken = DrugIPToken(0x18759204f9B7198C4990e1d28BD5fbeCdCF521B2);

    function setUp() public {}

    function run() public {
        vm.createSelectFork("fuji");
        vm.startBroadcast();

        // drugIPToken.enableChain(16015286601757825753,0x6fc8d8526aDF846b21DEbA79994129858B8B7EB3,encode(200_000));
        drugIPToken.ccSafeTransferFrom{value: 0.15 ether}(
            msg.sender, msg.sender, 0, 1, encode(250_000), 16015286601757825753, DrugIPToken.PayFeesIn.Native
        );

        vm.stopBroadcast();
    }

    function encode(uint256 gasLimit) internal pure returns (bytes memory extraArgsBytes) {
        Client.EVMExtraArgsV1 memory extraArgs = Client.EVMExtraArgsV1({gasLimit: gasLimit});
        extraArgsBytes = Client._argsToBytes(extraArgs);
    }
}

contract EnableSepFuji is Script {
    DrugIPToken public drugIPToken = DrugIPToken(0x850B8D455b5228E86F8160746aa2d904d937d941);

    function setUp() public {}

    function run() public {
        vm.createSelectFork("sepolia");
        vm.startBroadcast();
        console.log(msg.sender);

        // drugIPToken.enableChain(14767482510784806043, 0xbE5b5ee34f4A30A77B8383890A22c653a331c04C, encode(200_000));
        drugIPToken.ccSafeTransferFrom{value: 0.2 ether}(
            msg.sender, msg.sender, 0, 1, encode(300_000), 14767482510784806043, DrugIPToken.PayFeesIn.Native
        );

        vm.stopBroadcast();
    }

    function encode(uint256 gasLimit) public pure returns (bytes memory extraArgsBytes) {
        Client.EVMExtraArgsV1 memory extraArgs = Client.EVMExtraArgsV1({gasLimit: gasLimit});
        extraArgsBytes = Client._argsToBytes(extraArgs);
    }
}
