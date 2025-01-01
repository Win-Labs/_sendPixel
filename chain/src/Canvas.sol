// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Canvas {
    // Event emitted when a pixel is registered (when Ether is received)
    event PixelRegistered(
        uint256 amount,
        address sender,
        address contractAddress
    );

    // Event emitted when the canvas is locked after the duration
    event CanvasLocked(address contractAddress);

    uint256 public creationTime;
    uint256 public activeDuration;
    bool public isActive;
    // Address of the deployer who will receive funds
    address public walletAddress;

    constructor(uint256 _activeDuration, address _walletAddress) {
        activeDuration = _activeDuration;
        creationTime = block.timestamp;
        isActive = true;
        walletAddress = _walletAddress;
    }

    // Function to accept Ether and emit the PixelRegistered event
    receive() external payable {
        require(isActive, "Canvas is locked");
        emit PixelRegistered(msg.value, msg.sender, address(this));

        if (block.timestamp >= creationTime + activeDuration) {
            isActive = false;

            // Transfer all funds to the wallet address
            uint256 balance = address(this).balance;
            if (balance > 0) {
                payable(walletAddress).transfer(balance);
            }

            emit CanvasLocked(address(this));
        }
    }
}
