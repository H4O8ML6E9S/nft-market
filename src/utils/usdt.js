/*
 * @Author: 南宫
 * @Date: 2023-12-14 19:02:52
 * @LastEditTime: 2023-12-15 15:18:00
 */
import { ethers } from 'ethers';
import ABI from '../contracts/cUSDT.json';

let provider = new ethers.BrowserProvider(window.ethereum)
const contractAddress = process.env.REACT_APP_cUSDTAdrss;

// 授权合约账户操作用户的cUSDT
export async function approve (spender, amount) {
  const contract = new ethers.Contract(contractAddress, ABI, await provider.getSigner());
  const result = await contract.approve(spender, amount);
  console.log('approve successfully', result.hash);
}

// 查看是否有操控的权利
export async function getAllowance (owner, spender) {
  const contract = new ethers.Contract(contractAddress, ABI, await provider.getSigner());
  const result = await contract.allowance(owner, spender);
  return Number(result);
}
