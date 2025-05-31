// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {DrugIPToken, DrugIPUpkeep} from "../src/DrugIp.sol";

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
        console.log("DrugIPUpkeep address: ", address(drugIPUpkeep));
        console.log("DrugToken address: ", address(drugIPToken));

        vm.stopBroadcast();
    }
}
