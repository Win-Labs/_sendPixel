#!/bin/bash

# First, run `chmod +x run.sh` to make this file executable
# Then, run `./run.sh`


# Navigate to the chain directory and build the project
cd chain || exit
forge build &&
anvil &

# Wait for 3 seconds to ensure anvil is running
sleep 3

# Deploy the contract
forge create \
  --rpc-url http://127.0.0.1:8545 \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  src/CanvasDeployer.sol:CanvasDeployer || exit

# Navigate to the server directory and set up the server
cd ../server || exit
pnpm install && pnpm run dev &

# Navigate to the client directory and set up the client
cd ../client || exit
pnpm install && pnpm run dev &