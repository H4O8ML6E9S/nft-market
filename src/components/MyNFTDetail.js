/*
 * @Author: 南宫
 * @Date: 2023-12-14 19:02:52
 * @LastEditTime: 2023-12-16 16:53:42
 */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOrder, cancelOrder } from '../utils/market.js';
import { getMetadata, Listing } from '../utils/nft.js';
import { getAllowance } from '../utils/usdt.js';
import '../App.css';

const NFTDetail = () => {

  const { tokenId } = useParams();
  const [metadata, setMetadata] = useState('');
  const [allowance, setAllowance] = useState(0);

  const getWalletAddress = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        return accounts[0];
      } catch (error) {
        console.error('Error connecting to wallet:', error);
      }
    }
  };

  // 处理上架按钮
  const handleBuyClick = async (flag) => {
    if (flag === '1') {
      const res = await cancelOrder(tokenId);
      console.log(res);
    } else {
      const res = await Listing(tokenId);
      console.log(res);
    }
  };

  const [order, setOrder] = useState('');
  const [isListed, setLsListed] = useState('');
  useEffect(() => {
    const getInfo = async () => {
      const address = await getWalletAddress();
      const metadata = await getMetadata(tokenId);
      const allowance = await getAllowance(address, process.env.REACT_APP_USER);
      const order = await getOrder(tokenId);
      const isListed = order.seller !== '0x0000000000000000000000000000000000000000' ? 1 : 0;
      // console.log('order=', order);
      setOrder(order);
      // console.log('address', address)
      //console.log('allowance" , allov&nce);
      setMetadata(metadata);
      setAllowance(allowance);
      setLsListed(isListed);
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
        <p>Token ID: {tokenId}</p>
        <p>isListed: {isListed}</p>
        <p>
          {isListed === 1 ? (
            <button onClick={() => handleBuyClick('1')}>Cancel Order</button>
          ) : (
            <button onClick={() => handleBuyClick('0')}>Listing</button>
          )}</p>
      </div>
    </div>
  );
}

export default NFTDetail;