// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Canvas} from "./Canvas.sol";

contract CanvasDeployer {
    // Event emitted when a new Canvas contract is deployed
    event CanvasDeployed(
        address indexed deployer,
        address deployedCanvasContract,
        string name,
        uint256 height,
        uint256 width,
        uint256 mode,
        uint256 chainId,
        uint256 activeDuration,
        uint256 creationTime
    );

    function deployCanvas(
        string memory _name,
        uint256 _height,
        uint256 _width,
        uint256 _mode,
        uint256 _activeDuration
    ) public returns (address) {
        Canvas newCanvas = new Canvas(_activeDuration);

        emit CanvasDeployed(
            msg.sender,
            address(newCanvas),
            _name,
            _height,
            _width,
            _mode,
            block.chainid,
            _activeDuration,
            newCanvas.creationTime()
        );

        return address(newCanvas); // Return the deployed contract address
    }
}
