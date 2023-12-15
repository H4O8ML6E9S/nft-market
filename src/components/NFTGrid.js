/*
 * @Author: 南宫
 * @Date: 2023-12-14 19:02:52
 * @LastEditTime: 2023-12-15 21:17:20
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NFTCard from './NFTCard';
import { balanceOf, tokenOfOwnerByIndex } from '../utils/nft';
import '../App.css';

const NFTGrid = () => {
  const [nfts, setNfts] = useState([]);
  const navigate = useNavigate();

  // 实现NFT详细页的路由跳转
  const handleCardClick = (tokenId) => {
    navigate(`/nft-detail/${tokenId}`);
  };

  // 获取该用户所有的NFT
  /* 
   1.通过balanceof获取用户拥有的NFT数量
   2.通过tokenOfOwnerByIndex获取tokenId
   3.通过tokenURI获取nft的cid地址
  */
  useEffect(() => {
    const fetchNFTs = async () => {

      const length = await balanceOf(process.env.REACT_APP_USER);
      console.log('length', length);
      for (let i = 0; i < length; i++) {
        // 这里写成market的地址是因为后端safeTransferFrom给market，等于是上架了
        const tokenId = await tokenOfOwnerByIndex(process.env.REACT_APP_MarketAdrss, i);
        // console.log('i', i)
        setNfts((prev) => [...prev, tokenId]);
        setNfts((prev) => [...new Set(prev)])
      }
    };
    fetchNFTs();
  }, [])

  return (
    <div className="nft-grid">
      {nfts.map(nft => (
        <NFTCard tokenId={nft} onClick={() => handleCardClick(nft)} />
      ))}
    </div>
  );
};

export default NFTGrid;
