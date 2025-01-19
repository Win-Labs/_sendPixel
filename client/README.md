# 🎉 \_sendPixel

## 🎮 Demo:

https://send-pixel.vercel.app/

## 📝 Project Overview

\_sendPixel is a **unique blockchain-based game** that seamlessly blends **creativity, competition, and crowdfunding**. 🌟 The challenge of storing pixel data on-chain can be costly, but \_sendPixel introduces an innovative approach to solve this. Instead of directly storing pixel data, each pixel's **RGB color values and its coordinates (x, y)** are encoded into the **amount of native ETH** sent to the contract. This design leverages the blockchain's most cost-efficient function: **transferring coins**. 🎨💡

The structure is simple yet powerful — pixel data is represented in transactions as `0.0......0rgbxy`. A backend service then listens for on-chain events, decodes this data back into color and coordinates, and renders it on the frontend canvas. This transforms the experience into a **gamified canvas coloring game**, where participants can color pixels by sending ETH to a designated **Canvas contract address**.

Each canvas holds the ETH contributed by players, and the creator of the canvas can set a custom recipient to claim the accumulated funds. This means the project not only fuels collaborative art but also serves as a **gamified form of crowdfunding**, with creators benefiting from user contributions.

To maximize inclusivity and engagement, \_sendPixel is deployed across multiple blockchain networks, allowing users to select their preferred chain. This deployment encourages **healthy competition** among various Layer 2 solutions, contributing to a dynamic and diverse ecosystem. 🌐🚀

## 🛠️ Key Technologies

- **Frontend**: **React** with **Wagmi** for smooth wallet and contract interactions.
- **Backend**: **Viem** for direct blockchain communication and contract interaction.
- **Database**: **MongoDB** for scalable data storage.
- **Smart Contracts**: Developed in **Solidity** and deployed across **multiple networks** for flexible and reliable access.

## 💰 Sponsors

- **Scroll**: 💡 Innovate on Scroll ⸺ $10,000
  - Address of the `CanvasDeployer`: [0x2CdD0E57D3609Dc93047794409Ab2f9aAAfA4E4D](https://sepolia.scrollscan.com/address/0x2CdD0E57D3609Dc93047794409Ab2f9aAAfA4E4D)
  - Example Canvas contract: [0x11276e5dBf136194E28f9f3f111FA33294ff151c](https://sepolia.scrollscan.com/address/0x11276e5dBf136194E28f9f3f111FA33294ff151c)
- **Base**: 🔵 Most Based Award ⸺ $5,000
  - Address of the `CanvasDeployer`: [0x155bC4207709A0A7BFbDDD47C260B3f40aFD464c](https://base-sepolia.blockscout.com/address/0x155bC4207709A0A7BFbDDD47C260B3f40aFD464c)
  - Example Canvas contract: [0xCe72CF93667Ba644c5C559b21F0d803b419f0B8f](https://base-sepolia.blockscout.com/address/0xCe72CF93667Ba644c5C559b21F0d803b419f0B8f)
- **Linea**: 🦊 Best Project Deployed on Linea and MetaMask JSON-RPC API (Recommended) ⸺ $5,000
  - Address of the `CanvasDeployer`: [0x2CdD0E57D3609Dc93047794409Ab2f9aAAfA4E4D](https://explorer.sepolia.linea.build/address/0x2CdD0E57D3609Dc93047794409Ab2f9aAAfA4E4D)
- **Morph**: 🐨 Best Consumer Applications build on Morph ⸺ $5,000
  - Address of the `CanvasDeployer`: [0x155bC4207709A0A7BFbDDD47C260B3f40aFD464c](https://explorer-holesky.morphl2.io/address/0x155bC4207709A0A7BFbDDD47C260B3f40aFD464c)
  - Example Canvas contract: [0xb2111400c7B8097094CaD6e613D8Ca0462B83B93](https://explorer-holesky.morphl2.io/address/0xb2111400c7B8097094CaD6e613D8Ca0462B83B93)
- **NounsDao**: 🏗️ Best public good built with Nouns ⸺ $3,500
- **NounsDao**: 🖥️ Best application built with Nouns ⸺ $1,500
- **Privy**: 🥇 Best consumer app ⸺ $2,000
- **Privy**: 💌 Using Privy ⸺ $1,500
- **Web3Auth**: ⚡️ Best Use of Web3Auth Plug and Play Web SDKs ⸺ $1,500
  - Smooth authentication
- **World**: 🏊 World Pool Prize ⸺ $2,500
  - World is used for secure login, and also powers our canvas verification, adding a layer of trusted identity for interactions.

---

## ⚙️ Local Setup

### 1. **Set up the Frontend (Client)**

To run the frontend (website):

1. **Clone the repository**:

   ```bash
   git clone [https://github.com/your-repo/.git](https://github.com/mahammadZeynalov/_sendPixel.git)
   cd _sendPixel
   ```

2. **Navigate to the client directory**:

   ```bash
   cd client
   ```

3. **Install dependencies**:

   ```bash
   npm install
   ```

4. **Start the development server**:

   ```bash
   npm run dev
   ```

   The website should now be running locally at `http://localhost:5173`.

---

### 2. **Set up the Backend (Server)**

To run the backend (database):

1. **Navigate to the server directory**:

   ```bash
   cd server
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the backend server**:

   ```bash
   npm run dev
   ```

   The backend should now be running, and your database will be ready for use.
