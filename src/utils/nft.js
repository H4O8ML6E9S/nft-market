import { ethers } from 'ethers';
import ABI from '../contracts/MyNFT.json';
import MarketABI from '../contracts/Market.json';
import axios from 'axios';

// NFT合约
let provider = new ethers.BrowserProvider(window.ethereum)
const contractAddress = process.env.REACT_APP_NFTAdrss;
const contract = new ethers.Contract(contractAddress, ABI, await provider.getSigner());
// Market合约
const McontractAddress = process.env.REACT_APP_MarketAdrss;
const Mcontract = new ethers.Contract(contractAddress, MarketABI, await provider.getSigner());

// 上架
export async function Listing (tokenId) {
  const result = await contract.safeTransferFrom(
    process.env.REACT_APP_USER, McontractAddress, tokenId,
    "0x0000000000000000000000000000000000000000000000000001c6bf52634000", { gasLimit: 1000000 }
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
  console.log('tokenId=', tokenId);
  // console.log('result=', result);

  const response = await axios.get(result);
  // console.log('response=', response);

  return {
    title: response.data.title || '没有名称',
    description: response.data.description || '没有描述',
    imageURL: response.data.image,
  }
}
