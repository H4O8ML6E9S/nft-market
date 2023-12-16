/*
 * @Author: 南宫
 * @Date: 2023-12-07 23:16:42
 * @LastEditTime: 2023-12-16 15:28:39
 */
import { create } from 'kubo-rpc-client'
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config("./.env");

// connect to ipfs daemon API server
const ipfs = create(process.env.IPFS_URL);//到时候是给一个云服务器的地址


export async function uploadFileToIPFS (filePath) {
  const file = fs.readFileSync(filePath);
  const result = await ipfs.add({ path: filePath, content: file });
  console.log(result);
  return result;
}
// uploadFileToIPFS("files/20221219185922.png"); //测试

export async function uploadJSONToIPFS (json) {
  const result = await ipfs.add(JSON.stringify(json));
  // console.log(result);
  return result;
}
// uploadJSONToIPFS({ name: "test" })//测试


