/*
 * @Author: 南宫
 * @Date: 2023-12-14 19:02:52
 * @LastEditTime: 2023-12-25 15:09:52
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
  const [isShowButton, setisShowButton] = useState(false); //是否展示button
  const [selectedPrice, setSelectedPrice] = useState(parseFloat(order.price) || 0);
  const [isPricePopupVisible, setPricePopupVisible] = useState(false);


  // 用于比较，进行按钮展示
  let walletAddress;
  let orderSeller;

  const getWalletAddress = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        walletAddress = accounts[0];
        return accounts[0];
      } catch (error) {
        console.error('Error connecting to wallet:', error);
      }
    }
  };

  const handleBuyClick = async () => {
    // console.log(1111);
    try {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          walletAddress = accounts[0];
        } catch (error) {
          console.error('Error connecting to wallet:', error);
        }
      }
      // 没approve就先approve
      if (allowance === 0) {
        await approve(process.env.REACT_APP_MarketAdrss, "10000000000000000000000", { from: walletAddress });
      }
      // 等待approve完成后再执行buy
      console.log('当前buy账户', walletAddress);
      const res = await buy(tokenId, walletAddress);
      console.log('buy successfully', res);
    } catch (error) {
      console.error('Error buying NFT:', error);
    }
  };


  // 处理取消按钮
  const handlecancelClick = async () => {
    console.log('tokenId=', tokenId);
    let addr = await getWalletAddress();
    console.log('cancel addr=', addr);
    const res = await cancelOrder(tokenId, addr);
    console.log('Order canceled successfully', res);
  };


  // 处理修改价格
  const handlechangeClick = async () => {
    setPricePopupVisible(true); // 显示价格输入窗口
  };

  // 处理加减按钮点击事件
  const handlePriceChange = (amount) => {
    const newPrice = selectedPrice + amount;
    setSelectedPrice(newPrice < 0 ? 0 : newPrice);
  };

  // 处理确认修改价格
  const handleConfirmPrice = async () => {
    // 在这里可以添加发送修改价格的请求的逻辑
    console.log('New Price:', selectedPrice);
    let addr = getWalletAddress();
    console.log('cancel addr=', addr);
    const res = await changePrice(tokenId, selectedPrice, addr);
    console.log('change price successfully', res);
    setPricePopupVisible(false); // 隐藏价格输入窗口
  };


  useEffect(() => {
    const getInfo = async () => {
      const address = await getWalletAddress();
      const metadata = await getMetadata(tokenId);
      const order = await getOrder(tokenId);
      orderSeller = order.seller.toLowerCase();
      // console.log('orderSeller=', orderSeller);
      // console.log('walletAddress=', walletAddress);
      const allowance = await getAllowance(address, process.env.REACT_APP_MarketAdrss);
      setMetadata(metadata);
      setOrder(order);
      setAllowance(allowance);
      setisShowButton(walletAddress == orderSeller);
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
        <button style={{ display: isShowButton ? 'none' : 'block' }} onClick={handleBuyClick}>Buy</button>
        <button style={{ display: isShowButton ? 'block' : 'none' }} onClick={handlecancelClick}>Cancel Order</button>
        <span></span>
        <button style={{ display: isShowButton ? 'block' : 'none' }} onClick={handlechangeClick}>Change Order Price</button>
        {/* 弹出价格输入窗口 */}
        {isPricePopupVisible && (
          <div className="price-popup">
            <button onClick={() => handlePriceChange(-1)}>-</button>
            <span>{selectedPrice} USDT</span>
            <button onClick={() => handlePriceChange(1)}>+</button>
            <button onClick={handleConfirmPrice}>Confirm</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default NFTDetail;