/*
 * @Author: 南宫
 * @Date: 2023-12-14 19:02:52
 * @LastEditTime: 2023-12-25 15:12:37
 */
import { ethers } from 'ethers';
import ABI from '../contracts/Market.json';

let provider = new ethers.BrowserProvider(window.ethereum)
const contractAddress = process.env.REACT_APP_MarketAdrss;
const contract = new ethers.Contract(contractAddress, ABI, await provider.getSigner());

export async function buy (tokenId, userAddr) {
  console.log(111);
  /* 解决：eth_sendRawTransaction的问题
  Nonce too high. Expected nonce to be 5 but got 11. Note that transactions can't be queued when automining */
  const nonce = await provider.getTransactionCount(userAddr);
  console.log('nonce=', nonce);
  console.log('userAddr=', userAddr);
  const result = await contract.buy(tokenId);
  return result.hash;
}

export async function changePrice (tokenId, price, userAddr) {
  /* 解决：eth_sendRawTransaction的问题
 Nonce too high. Expected nonce to be 5 but got 11. Note that transactions can't be queued when automining */
  const nonce = await provider.getTransactionCount(userAddr);
  const result = await contract.changePrice(tokenId, price, { nonce: nonce });
  return result.hash;
}

export async function cancelOrder (tokenId, userAddr) {
  /* 解决：eth_sendRawTransaction的问题
 Nonce too high. Expected nonce to be 5 but got 11. Note that transactions can't be queued when automining */
  const nonce = await provider.getTransactionCount(userAddr);
  try {
    // Call the cancelOrder function on the smart contract
    const transaction = await contract.cancelOrder(tokenId, { nonce: nonce });
    // Wait for the transaction to be mined
    await transaction.wait();
    return transaction.hash;
  } catch (error) {
    console.error('Error canceling order:', error.message);
    return { success: false, message: 'Error canceling order' };
  }
}

export async function getAllNFTs () {
  const result = await contract.getAllNFTs();
  console.log(result);
}

export async function getMyNFTs () {
  const result = await contract.getMyNFTs();
  console.log(result);
}

export async function getOrder (tokenId) {
  const result = await contract.orderOfId(tokenId);
  return {
    seller: result[0],
    tokenId: Number(result[1]),
    price: Number(result[2]) / 1e18,
  }
}