/* eslint-disable no-undef */
/*
 * @Author: 南宫
 * @Date: 2023-12-23 23:04:09
 * @LastEditTime: 2023-12-23 23:34:09
 */
import Web3 from 'web3';
import { Transaction as EthereumTx } from 'ethereumjs-tx';

function ethToHex (ethAmount) {
  const weiAmount = Math.round(ethAmount * 1e18); // 四舍五入
  const hexString = weiAmount.toString(16);
  return '0x' + '0'.repeat(64 - hexString.length) + hexString;
}

// 示例用法
const ethAmount = 0.5;
const hexValue = ethToHex(ethAmount);
console.log(hexValue);



