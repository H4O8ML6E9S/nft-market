import { ethers } from 'ethers';
import ABI from '../contracts/MyNFT.json';
import axios from 'axios';

let provider = new ethers.BrowserProvider(window.ethereum)
const contractAddress = process.env.REACT_APP_NFTAdrss;
const contract = new ethers.Contract(contractAddress, ABI, await provider.getSigner());

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
  const response = await axios.get(result);
  return {
    title: response.data.title,
    description: response.data.description,
    imageURL: response.data.image,
  }
}
