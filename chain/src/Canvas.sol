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

    // Constructor to set the active duration and initialize creation time
    constructor(uint256 _activeDuration) {
        activeDuration = _activeDuration;
        creationTime = block.timestamp;
        isActive = true;
    }

    // Function to accept Ether and emit the PixelRegistered event
    receive() external payable {
        require(isActive, "Canvas is locked");
        emit PixelRegistered(msg.value, msg.sender, address(this));
    }

    // Function to check and lock the canvas if the duration has passed
    function lockCanvas() external {
        require(isActive, "Canvas is already locked");
        require(
            block.timestamp >= creationTime + activeDuration,
            "Active duration has not yet elapsed"
        );

        isActive = false;
        emit CanvasLocked(address(this));
    }
}
