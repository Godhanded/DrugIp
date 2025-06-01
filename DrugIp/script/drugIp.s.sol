// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {DrugIPToken} from "../src/DrugIp.sol";
import {DrugIPUpkeep} from "../src/DrugIPUpkeep.sol";

contract DrugIPScript is Script {
    DrugIPToken public drugIPToken;
    DrugIPUpkeep public drugIPUpkeep;

    function setUp() public {}

    function run() public {
        console.log(msg.sender);
        vm.startBroadcast();
        console.log(msg.sender);

        drugIPToken = new DrugIPToken(msg.sender);
        drugIPUpkeep = new DrugIPUpkeep(address(drugIPToken));
        console.log("DrugToken address: ", address(drugIPToken));
        console.log("DrugIPUpkeep address: ", address(drugIPUpkeep));

        vm.stopBroadcast();
    }
}
