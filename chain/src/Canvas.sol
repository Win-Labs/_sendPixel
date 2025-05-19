// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Canvas {
    event PixelRegistered(uint256 amount, address sender);

    function batchSend(uint256[] memory amounts) external payable {
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }

        require(msg.value == totalAmount, "Incorrect total amount");

        for (uint256 i = 0; i < amounts.length; i++) {
            (bool success, ) = address(this).call{value: amounts[i]}("");
            require(success, "Transfer failed");
        }
    }

    receive() external payable {
        emit PixelRegistered(msg.value, msg.sender);
    }
}
