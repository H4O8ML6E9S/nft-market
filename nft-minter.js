/*
 * @Author: 南宫
 * @Date: 2023-12-08 14:10:39
 * @LastEditTime: 2023-12-08 19:43:40
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
  const result = await contract.safeMint(to, uri);
  console.log("mint sucessfully!!", result.hash);
}

// mint("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", "http://xxx.com")