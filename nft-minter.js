/*
 * @Author: 南宫
 * @Date: 2023-12-08 14:10:39
 * @LastEditTime: 2023-12-23 13:38:19
 */
import { ethers, JsonRpcProvider } from "ethers";
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config("./.env");

export async function mint (to, uri) {
  const provider = new JsonRpcProvider(process.env.RPC);
  const signer = await provider.getSigner();
  const abi = JSON.parse(fs.readFileSync("./abis/MyNFT.json"));
  const contract = new ethers.Contract(process.env.NFT, abi, signer);
  const result = await contract.safeMint(to, uri); //mint一个nft
  console.log("mint sucessfully!!", result.hash);
  // const marketContractAddress = process.env.MARKET;

  // const total_nft = await contract.balanceOf(to);
  // // console.log('total_nft', total_nft);

  // // /* 想实现自己挖nft且不上架，就把下面的代码都禁了 */
  // // 授权market使用nft
  // const approveResult = await contract.connect(signer).approve(marketContractAddress, Number(total_nft) - 1); // Assuming tokenId is 1, adjust accordingly
  // console.log('Approval for transfer to market contract:', approveResult.hash);

  // // 获取最新的nft
  // const tokenID = await contract.tokenOfOwnerByIndex(to, Number(total_nft) - 1);
  // console.log('tokenID', tokenID);

  // // 将nft上架
  // const res = await contract.safeTransferFrom(to, marketContractAddress, Number(total_nft) - 1, "0x0000000000000000000000000000000000000000000000000001c6bf52634000", { gasLimit: 1000000 });
  // // console.log(res.hash);
}

// mint("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", "http://xxx.com")