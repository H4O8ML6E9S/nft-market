/*
 * @Author: 南宫
 * @Date: 2023-12-14 19:02:52
 * @LastEditTime: 2023-12-23 23:00:54
 */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMetadata } from '../utils/nft.js';
import { getOrder, buy, cancelOrder, changePrice } from '../utils/market.js';
import { getAllowance, approve } from '../utils/usdt.js';
import '../App.css';

const NFTDetail = () => {

  const { tokenId } = useParams();
  const [metadata, setMetadata] = useState('');
  const [order, setOrder] = useState('');
  const [allowance, setAllowance] = useState(0);
  const [isShow, setisShow] = useState(false); //是否展示
  const [priceInput, setPriceInput] = useState(''); //获取价格


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


  const handleBuyClick = async () => {
    try {
      // 没approve就先approve
      if (allowance === 0) {
        await approve(process.env.REACT_APP_MarketAdrss, "10000000000000000000000", { from: walletAddress });
      }
      // 等待approve完成后再执行buy
      await buy(tokenId);
    } catch (error) {
      console.error('Error buying NFT:', error);
    }
  };


  // 处理取消按钮
  const handlecancelClick = async () => {
    console.log('tokenId=', tokenId);
    const res = await cancelOrder(tokenId);
    console.log(res);
  };


  // 处理修改价格
  const handlechangeClick = async () => {
    setisShow(true); // 显示控件
    console.log('tokenId=', tokenId);
    console.log('priceInput=', priceInput);
    const res = await changePrice(tokenId, priceInput);
    console.log(res);
  };


  useEffect(() => {
    const getInfo = async () => {
      const address = await getWalletAddress();
      const metadata = await getMetadata(tokenId);
      const order = await getOrder(tokenId);
      orderSeller = order.seller.toLowerCase();

      // console.log('orderSeller=', orderSeller);
      console.log('walletAddress=', walletAddress);
      // console.log('address=', address);

      const allowance = await getAllowance(address, process.env.REACT_APP_MarketAdrss);
      setMetadata(metadata);
      setOrder(order);
      setAllowance(allowance);
      setisShow(walletAddress == orderSeller);
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
        <button style={{ display: isShow ? 'none' : 'block' }} onClick={handleBuyClick}>Buy</button>
        <button style={{ display: isShow ? 'block' : 'none' }} onClick={handlecancelClick}>Cancel Order</button>
        <h6></h6>
        <button style={{ display: isShow ? 'block' : 'none' }} onClick={handlechangeClick}>Change Order Price</button>
      </div>
    </div>
  );
}

export default NFTDetail;