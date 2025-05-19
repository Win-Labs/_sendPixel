#!/bin/bash

PRIVATE_KEY=0xfc15da464743c880bdd14c911c84d87d86bb4c08ba11350473b53a0d1959cc3d
RPC_URL=http://14.32.133.68:8545
WIDTH=1024
HEIGHT=1024
PATH_TO_SMART_CONTRACT=./src/CanvasDeployer.sol:CanvasDeployer

echo "Deploying contract..."
DEPLOY_OUTPUT=$(forge create --broadcast --rpc-url $RPC_URL --private-key $PRIVATE_KEY $PATH_TO_SMART_CONTRACT --constructor-args $WIDTH $HEIGHT)

# Extract deployed address
SMART_CONTRACT_ADDRESS=$(echo "$DEPLOY_OUTPUT" | awk '/Deployed to:/ { print $3 }')

# Extract transaction hash
TX_HASH=$(echo "$DEPLOY_OUTPUT" | awk '/Transaction hash:/ { print $3 }')

echo "✅ Smart contract deployed at: $SMART_CONTRACT_ADDRESS"
echo "🔗 Tx hash: $TX_HASH"
