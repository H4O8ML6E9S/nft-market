/*
 * @Author: 南宫
 * @Date: 2023-12-14 19:02:52
 * @LastEditTime: 2023-12-23 22:23:54
 */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOrder, cancelOrder } from '../utils/market.js';
import { getMetadata, Listing } from '../utils/nft.js';
import '../App.css';

const NFTDetail = () => {

  const { tokenId } = useParams();
  const [metadata, setMetadata] = useState('');

  // 处理上架按钮
  const handleBuyClick = async () => {
    // 获取当前账户，用于上架nft
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        // 2.处理上架
        const res = await Listing(tokenId, accounts[0]);
        console.log(res);
      } catch (error) {
        console.error('Error connecting to wallet:', error);
      }
    }
  };


  const [order, setOrder] = useState('');
  const [isListed, setLsListed] = useState('');

  useEffect(() => {
    const getInfo = async () => {
      const metadata = await getMetadata(tokenId);
      const order = await getOrder(tokenId);
      const isListed = order.seller !== '0x0000000000000000000000000000000000000000' ? 1 : 0;
      // console.log('order=', order);
      setOrder(order);
      //console.log('allowance" , allov&nce);
      setMetadata(metadata);
      setLsListed(isListed);
    }
    getInfo();
  }, []);

  return (
    <div className="nft-detail">
      <div className="nft-image">
        <img src={metadata.imageURL} alt={metadata.title} />
      </div>
      <div className="nft-info">
        <h3>{metadata.title}</h3>
        <p>{metadata.description}</p>
        <p>Token ID: {tokenId}</p>
        <p>isListed: {isListed}</p>
        <button onClick={() => handleBuyClick()}>Listing</button>
      </div>
    </div>
  );
}

export default NFTDetail;