# 🎉 _sendPixel

## 🎮 Demo: 

https://send-pixel.vercel.app/


## 📝 Project Overview

_sendPixel is a **unique blockchain-based game** that seamlessly blends **creativity, competition, and crowdfunding**. 🌟 The challenge of storing pixel data on-chain can be costly, but _sendPixel introduces an innovative approach to solve this. Instead of directly storing pixel data, each pixel's **RGB color values and its coordinates (x, y)** are encoded into the **amount of native ETH** sent to the contract. This design leverages the blockchain's most cost-efficient function: **transferring coins**. 🎨💡

The structure is simple yet powerful — pixel data is represented in transactions as `0.0......0rgbxy`. A backend service then listens for on-chain events, decodes this data back into color and coordinates, and renders it on the frontend canvas. This transforms the experience into a **gamified canvas coloring game**, where participants can color pixels by sending ETH to a designated **Canvas contract address**.

Each canvas holds the ETH contributed by players, and the creator of the canvas can set a custom recipient to claim the accumulated funds. This means the project not only fuels collaborative art but also serves as a **gamified form of crowdfunding**, with creators benefiting from user contributions.

To maximize inclusivity and engagement, _sendPixel is deployed across multiple blockchain networks, allowing users to select their preferred chain. This deployment encourages **healthy competition** among various Layer 2 solutions, contributing to a dynamic and diverse ecosystem. 🌐🚀

## 🛠️ Key Technologies

- **Frontend**: **React** with **Wagmi** for smooth wallet and contract interactions.
- **Backend**: **Viem** for direct blockchain communication and contract interaction.
- **Database**: **MongoDB** for scalable data storage.
- **Smart Contracts**: Developed in **Solidity** and deployed across **multiple networks** for flexible and reliable access.

## 📐 Architecture

![image](https://github.com/user-attachments/assets/c4d81947-2637-4bd9-a038-1e3367c56d4d)

## 💰 Sponsors

- **Scroll**: 💡 Innovate on Scroll ⸺ $10,000
  - Address of the `CanvasDeployer`: `0x2CdD0E57D3609Dc93047794409Ab2f9aAAfA4E4D`
  - `CanvasDeployer` deploys `Canvas` contracts on users' demands
- **Base**: 🔵 Most Based Award ⸺ $5,000
  - Contract address: `0x155bc4207709a0a7bfbddd47c260b3f40afd464c`
  - `CanvasDeployer` deploys `Canvas` contracts on users' demands
- **Linea**: 🦊 Best Project Deployed on Linea and MetaMask JSON-RPC API (Recommended) ⸺ $5,000
  - Contract address: `0x2CdD0E57D3609Dc93047794409Ab2f9aAAfA4E4D`
  - `CanvasDeployer` deploys `Canvas` contracts on users' demands
- **Morph**: 🐨 Best Consumer Applications build on Morph ⸺ $5,000
  - Contract address: `0x155bc4207709a0a7bfbddd47c260b3f40afd464c`
  - `CanvasDeployer` deploys `Canvas` contracts on users' demands
- **NounsDao**: 🏗️ Best public good built with Nouns ⸺ $3,500
- **NounsDao**: 🖥️ Best application built with Nouns ⸺ $1,500
- **Push Protocol**: 🖥️ Thai Street Food - Creative Bounty ⸺ $2,500
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

