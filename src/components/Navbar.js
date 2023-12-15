/*
 * @Author: 南宫
 * @Date: 2023-12-13 14:12:54
 * @LastEditTime: 2023-12-13 14:40:55
 */

import '../App.css'; // Make sure you have the css file for styling

/* 要写成解构赋值的方式 */
function Navbar ({ onConnectWallet, walletAddress }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">NFT Marketplace</div>
      <div className="navbar-menu">
        <button
          className="connect-wallet-button" onClick={onConnectWallet}>{walletAddress.slice(0, 6) + "..." + walletAddress.slice(38, 42) || "Connect Wallet"}</button>
      </div>
    </nav>
  )
}
export default Navbar;
