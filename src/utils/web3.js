import { ethers } from 'ethers';
import MyNFTABI from '../contracts/MyNFT.json';

async function main () {
  let provider = new ethers.BrowserProvider(window.ethereum)
  const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  let account = await provider.getSigner();

  const contract = new ethers.Contract(contractAddress, MyNFTABI, account);
  const result = await contract.totalSupply();
  await contract.safeMint('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', 'https://ipfs.io/ipfs/QmZ4tj')
  console.log(result.toString());
}


export default main;