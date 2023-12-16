/*
 * @Author: 南宫
 * @Date: 2023-12-14 19:02:52
 * @LastEditTime: 2023-12-16 16:35:06
 */
import { useEffect, useState } from 'react';
import { getMetadata } from '../utils/nft.js';
import '../App.css';

const NFTCard = ({ tokenId, onClick }) => {
  // console.log(tokenId)
  const [metadata, setMetadata] = useState('');

  useEffect(() => {
    const getInfo = async () => {
      const metadata = await getMetadata(tokenId);
      console.log('metadata=', metadata);
      setMetadata(metadata);
    }
    getInfo();
  }, []);

  /* onClick实现自动跳转到NFT详细页面 */
  return (
    <div className="nft-card" onClick={onClick}>
      <div className="nft-image">
        <img src={metadata.imageURL} alt={metadata.title} />
      </div>
      <div className="nft-info">
        <h3>{metadata.title}</h3>
        <p>TokenId: {tokenId} </p>
      </div>
    </div>
  );
};
export default NFTCard;
