/*
 * @Author: 南宫
 * @Date: 2023-12-14 19:02:52
 * @LastEditTime: 2023-12-23 22:48:42
 */
import { useEffect, useState } from 'react';
import { getMetadata } from '../utils/nft.js';
import { getOrder } from '../utils/market.js';
import '../App.css';

const NFTCard = ({ tokenId, onClick }) => {
  // console.log(tokenId)
  const [metadata, setMetadata] = useState('');
  const [order, setOrder] = useState('');

  useEffect(() => {
    const getInfo = async () => {
      // console.log("NFTCard tokenId=", tokenId);
      const metadata = await getMetadata(tokenId);
      // console.log('metadata=', metadata);
      const order = await getOrder(tokenId);
      console.log('order=', order);
      setMetadata(metadata);
      setOrder(order);
    }
    getInfo();
  }, [tokenId]);

  /* onClick实现自动跳转到NFT详细页面 */
  return (
    <div className="nft-card" onClick={onClick}>
      <div className="nft-image">
        <img src={metadata.imageURL} alt={metadata.title} />
      </div>
      <div className="nft-info">
        <h3>{metadata.title}</h3>
        <p>Price: {order.price} USDT</p>
      </div>
    </div>
  );
};
export default NFTCard;
