/*
 * @Author: 南宫
 * @Date: 2023-12-14 19:02:52
 * @LastEditTime: 2023-12-23 14:08:17
 */
import { ethers } from 'ethers';
import ABI from '../contracts/Market.json';

let provider = new ethers.BrowserProvider(window.ethereum)
const contractAddress = process.env.REACT_APP_MarketAdrss;
const contract = new ethers.Contract(contractAddress, ABI, await provider.getSigner());

export async function buy (tokenId) {
  const result = await contract.buy(tokenId);
  console.log('buy', result.hash);
}

export async function changePrice (tokenId, price) {
  const result = await contract.changePrice(tokenId, price);
  console.log('change price', result.hash);
}

export async function cancelOrder (tokenId) {
  try {
    // Call the cancelOrder function on the smart contract
    const transaction = await contract.cancelOrder(tokenId);
    // Wait for the transaction to be mined
    await transaction.wait();
    console.log('Order canceled successfully:', transaction.hash);
    return { success: true, message: 'Order canceled successfully' };
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