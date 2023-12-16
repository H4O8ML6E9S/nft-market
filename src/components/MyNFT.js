import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MyNFTCard from './MyNFTCard';
import { balanceOf, tokenOfOwnerByIndex } from '../utils/nft';
import '../App.css';

const MyNFT = () => {

  //获取所有的NFT
  const [nfts, setNfts] = useState([]);
  const navigate = useNavigate();

  // 实现NFT详细页的路由跳转
  const handleCardClick = (tokenId) => {
    navigate(`/mynft-detail/${tokenId}`);
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
        //获取用户拥有的NFT数量
        const tokenId = await tokenOfOwnerByIndex(process.env.REACT_APP_USER, i);
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
        <MyNFTCard key={nft.tokenId} tokenId={nft} onClick={() => handleCardClick(nft)} />
      ))}
    </div>
  );
};

export default MyNFT;