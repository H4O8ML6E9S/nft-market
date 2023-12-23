/*
 * @Author: 南宫
 * @Date: 2023-12-14 19:02:52
 * @LastEditTime: 2023-12-23 21:20:05
 */
import { ethers } from 'ethers';
import ABI from '../contracts/MyNFT.json';
import axios from 'axios';

// NFT合约
let provider = new ethers.BrowserProvider(window.ethereum)
const contractAddress = process.env.REACT_APP_NFTAdrss;
const contract = new ethers.Contract(contractAddress, ABI, await provider.getSigner());
// Market合约
const McontractAddress = process.env.REACT_APP_MarketAdrss;

// 上架
export async function Listing (tokenId, userAddr) {
  console.log('userAddr=', userAddr);
  /* 解决：eth_sendRawTransaction的问题
  Nonce too high. Expected nonce to be 5 but got 11. Note that transactions can't be queued when automining */
  const nonce = await provider.getTransactionCount(userAddr);
  const result = await contract.safeTransferFrom(
    userAddr, McontractAddress, tokenId,
    "0x0000000000000000000000000000000000000000000000000001c6bf52634000", { gasLimit: 1000000, nonce: nonce }
  );
  console.log('Listing', result.hash);
}

/* 1.通过balanceof获取用户拥有的NFT数量
   2.通过tokenOfOwnerByIndex获取tokenId
   3.通过tokenURI获取nft的cid地址
*/
export async function balanceOf (address) {
  const result = await contract.balanceOf(address);
  return Number(result);
}
export async function tokenOfOwnerByIndex (owner, index) {
  const result = await contract.tokenOfOwnerByIndex(owner, index);
  return Number(result);
}
export async function tokenURI (tokenId) {
  const result = await contract.tokenURI(tokenId);
  console.log(result);
}

/* 将Metadata数据解析 */
export async function getMetadata (tokenId) {

  const result = await contract.tokenURI(tokenId);
  // console.log('tokenId=', tokenId);
  // console.log('result=', result);

  const response = await axios.get(result);
  // console.log('response=', response);

  return {
    title: response.data.title || '没有名称',
    description: response.data.description || '没有描述',
    imageURL: response.data.image,
  }
}
