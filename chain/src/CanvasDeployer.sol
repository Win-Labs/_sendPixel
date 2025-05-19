// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Canvas} from "./Canvas.sol";

contract CanvasDeployer {
    event CanvasDeployed(address deployedCanvasContract, uint256 height, uint256 width);

    function deployCanvas(uint256 _width, uint256 _height) public returns (address) {
        Canvas newCanvas = new Canvas();

        emit CanvasDeployed(address(newCanvas), _height, _width);

        return address(newCanvas);
    }
}
