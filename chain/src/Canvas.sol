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

    // Timestamp of contract creation
    uint256 public creationTime;
    // Active duration in seconds
    uint256 public activeDuration;
    // Canvas active state
    bool public isActive;
    // Address of the deployer who will receive funds
    address public walletAddress;

    // Constructor to set the active duration and initialize creation time
    constructor(uint256 _activeDuration, address _walletAddress) {
        activeDuration = _activeDuration;
        creationTime = block.timestamp;
        isActive = true;
        walletAddress = _walletAddress;
    }

    // Modifier to check if canvas is still active
    modifier checkAndLock() {
        if (isActive && block.timestamp >= creationTime + activeDuration) {
            isActive = false;
            emit CanvasLocked(address(this));

            // Transfer all funds to the owner
            uint256 balance = address(this).balance;
            if (balance > 0) {
                payable(walletAddress).transfer(balance);
            }
        }
        _;
    }

    // Function to accept Ether and emit the PixelRegistered event
    receive() external payable checkAndLock {
        require(isActive, "Canvas is locked");
        emit PixelRegistered(msg.value, msg.sender, address(this));
    }
}
