/*
 * @Author: 南宫
 * @Date: 2023-12-14 19:02:52
 * @LastEditTime: 2023-12-16 17:31:47
 */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMetadata } from '../utils/nft.js';
import { getOrder, buy, cancelOrder } from '../utils/market.js';
import { getAllowance, approve } from '../utils/usdt.js';
import '../App.css';

const NFTDetail = () => {

  const { tokenId } = useParams();
  const [metadata, setMetadata] = useState('');
  const [order, setOrder] = useState('');
  const [allowance, setAllowance] = useState(0);

  // 用于比较，进行按钮展示
  let walletAddress;
  let orderSeller;

  const getWalletAddress = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        walletAddress = accounts[0].toLowerCase();
        return accounts[0];
      } catch (error) {
        console.error('Error connecting to wallet:', error);
      }
    }
  };


  // 没approve就先approve
  const handleBuyClick = async () => {
    if (allowance === 0) {
      await approve(process.env.REACT_APP_USER, "10000000000000000000000");
    } else {
      await buy(tokenId);
    }
  };

  // 处理取消按钮
  const handlecancelClick = async () => {
    const res = await cancelOrder(tokenId);
    console.log(res);
  };

  useEffect(() => {
    const getInfo = async () => {
      const address = await getWalletAddress();
      const metadata = await getMetadata(tokenId);
      const order = await getOrder(tokenId);
      orderSeller = order.seller.toLowerCase();
      const allowance = await getAllowance(address, process.env.REACT_APP_USER);
      // console.log('address', address)
      //console.log('allowance" , allov&nce);
      setMetadata(metadata);
      setOrder(order);
      setAllowance(allowance);
    }
    getInfo();
  }, [allowance]);

  return (
    <div className="nft-detail">
      <div className="nft-image">
        <img src={metadata.imageURL} alt={metadata.title} />
      </div>
      <div className="nft-info">
        <h3>{metadata.title}</h3>
        <p>{metadata.description}</p>
        <p>Seller: {order.seller}</p>
        <p>Price: {order.price} USDT</p>
        <p>Token ID: {order.tokenId}</p>
        <button onClick={handleBuyClick}>Buy</button>
        {walletAddress === orderSeller ? (
          <button onClick={handlecancelClick}>Cancel Order</button>
        ) : null}
      </div>
    </div>
  );
}

export default NFTDetail;