/*
 * @Author: 南宫
 * @Date: 2023-12-14 19:02:52
 * @LastEditTime: 2023-12-23 11:00:28
 */
import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar.js';
import MyNFT from './components/MyNFT.js';
import UploadSuccess from './components/UploadSuccess.js';
import UploadImage from './components/UploadImage.js'
import NFTGrid from './components/NFTGrid.js'
import NFTDetail from './components/NFTDetail.js'
import MyNFTDetail from './components/MyNFTDetail.js'

function App () {

  const [walletAddress, setwalletAddress] = useState("");

  useEffect(() => {
    getwalletAddress();
    addWalletListener();
  }, []);

  // 设置初始化的钱包
  async function getwalletAddress () {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      setwalletAddress(account);
    } else {
      alert("Please install MetaMask");
    }
  }

  // 修改钱包
  function addWalletListener () {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setwalletAddress(accounts[0]);
        } else {
          setwalletAddress("");
        }
      });
    }
    else {
      alert("Please install MetaMask");
    }
  }

  return (
    <div className="container">
      <Router>
        <Navbar onConnectWallet={getwalletAddress} walletAddress={walletAddress} />
        <Routes>
          <Route path='/' exact element={<UploadImage address={walletAddress} />} />
          <Route path="/nfts" element={<NFTGrid />} />
          <Route path="/Mynfts" element={<MyNFT />} />
          <Route path="/nft-detail/:tokenId" element={<NFTDetail />} />
          <Route path="/mynft-detail/:tokenId" element={<MyNFTDetail />} />
          <Route path="/success" element={<UploadSuccess />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
