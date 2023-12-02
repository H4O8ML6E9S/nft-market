/*
 * @Author: 南宫
 * @Date: 2023-12-01 11:04:12
 * @LastEditTime: 2023-12-01 18:42:31
 */
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Market", function () {
  let usdt, market, myNft, accountA, accountB;
  let baseURI = "https://sameple.com/";

  beforeEach(async () => {
    [accountA, accountB] = await ethers.getSigners();
    // const MAX_ALLOWANCE = BigNumber.from(2).pow(256).sub(1);
    const USDT = await ethers.getContractFactory("cUSDT");
    usdt = await USDT.deploy();
    const MyNFT = await ethers.getContractFactory("NFTM");
    myNft = await MyNFT.deploy(accountA.address);
    const Market = await ethers.getContractFactory("Market");
    market = await Market.deploy(usdt.target, myNft.target);
    // console.log('accountA=', accountA.address) //0xf39F
    // console.log('accountB=', accountB.address) //0x7099

    // await myNft.safeMint(accountB.address, baseURI + "0");
    // await myNft.safeMint(accountB.address, baseURI + "1");
    await myNft.safeMint(accountA.address);
    await myNft.safeMint(accountA.address);
    await myNft.approve(market.target, 0);
    await myNft.approve(market.target, 1);
    await usdt.transfer(accountB.address, "10000000000000000000000");
    // await myNft.connect(accountA).setApprovalForAll(accountB.address);

    //不写connect就是默认连接到第一个账户
    await usdt.connect(accountB).approve(market.target, "1000000000000000000000000");

  });

  it('its erc20 address should be usdt', async function () {
    // target==address
    expect(await market.erc20()).to.equal(usdt.target);
  });

  it('its erc721 address should be myNft', async function () {
    expect(await market.erc721()).to.equal(myNft.target);
  });

  it('account1 should have 2 nfts', async function () {
    expect(await myNft.balanceOf(accountA.address)).to.equal(2);
  });

  it('account2  should have 10000 USDT', async function () {
    expect(await usdt.balanceOf(accountB.address)).to.equal("10000000000000000000000");
  });

  it('account2 should have 0 nfts', async function () {
    expect(await myNft.balanceOf(accountB.address)).to.equal(0);
  });

  it('account1 can list two nfts to market', async function () {
    const price = "0x0000000000000000000000000000000000000000000000000001c6bf52634000";
    expect(await myNft['safeTransferFrom(address,address,uint256,bytes)'](accountA.address, market.target, 0, price)).to.emit(market, "NewOrder");
    expect(await myNft['safeTransferFrom(address,address,uint256,bytes)'](accountA.address, market.target, 1, price)).to.emit(market, "NewOrder");

    // expect(await myNft.balanceOf(accountA.address)).to.equal(0);
    // expect(await myNft.balanceOf(market.target)).to.equal(2);
    // expect(await market.isListed(0)).to.equal(true);
    // expect(await market.isListed(1)).to.equal(true);

    // expect((await market.getAllNFTs())[0][0]).to.equal(accountA.address);
    // expect((await market.getAllNFTs())[0][1]).to.equal(0);
    // expect((await market.getAllNFTs())[0][2]).to.equal(price);
    // expect((await market.getAllNFTs())[1][0]).to.equal(accountA.address);
    // expect((await market.getAllNFTs())[1][1]).to.equal(1);
    // expect((await market.getAllNFTs())[1][2]).to.equal(price);
    expect(await market.getOrderLength()).to.equal(2);

    expect((await market.connect(accountA).getMyNFTs())[0][0]).to.equal(accountA.address);
    expect((await market.connect(accountA).getMyNFTs())[0][1]).to.equal(0);
    expect((await market.connect(accountA).getMyNFTs())[0][2]).to.equal(price);

  })

  it('account1 can unlist one nft from market', async function () {
    const price = "0x0000000000000000000000000000000000000000000000000001c6bf52634000";
    // List one NFT for sale
    await myNft['safeTransferFrom(address,address,uint256,bytes)'](accountA.address, market.target, 0, price);
    // Ensure the NFT is listed
    expect(await market.isListed(0)).to.equal(true);
    // Unlist the NFT
    await market.cancelOrder(0);
    // Ensure the NFT is no longer listed
    expect(await market.isListed(0)).to.equal(false);
    // Ensure the NFT is back in the owner's account
    expect(await myNft.balanceOf(accountA.address)).to.equal(2);
  });

  it('account1 can change price of nft from market', async function () {
    const initialPrice = "0x0000000000000000000000000000000000000000000000000001c6bf52634000";
    const newPrice = "0x0000000000000000000000000000000000000000000000000002d3c7f8a0000";
    // List one NFT for sale
    await myNft['safeTransferFrom(address,address,uint256,bytes)'](accountA.address, market.target, 0, initialPrice);
    // Change the price of the listed NFT
    await market.changePrice(0, newPrice);
    // Ensure the price is changed
    const updatedOrder = await market.orderOfId(0);
    expect(updatedOrder.price).to.equal(newPrice);
    // Ensure the event is emitted
    expect(await market.getOrderLength()).to.equal(1);
    expect((await market.connect(accountA).getMyNFTs())[0][2]).to.equal(newPrice);
  });

  it('account2 can buy nft from market', async function () {
    // List an NFT for sale
    const price = "0x0000000000000000000000000000000000000000000000000001c6bf52634000";
    await myNft['safeTransferFrom(address,address,uint256,bytes)'](accountA.address, market.target, 0, price);
    // Ensure the NFT is listed
    expect(await market.isListed(0)).to.equal(true);
    // Get the buyer's initial balance
    let initialBalanceB = await usdt.balanceOf(accountB.address);
    let initialBalanceA = await usdt.balanceOf(accountA.address);
    // Buy the NFT
    await market.connect(accountB).buy(0);
    // Ensure the NFT is no longer listed
    expect(await market.isListed(0)).to.equal(false);
    // Ensure the buyer's balance has been reduced by the NFT price
    const finalBalance = BigInt(await usdt.balanceOf(accountB.address));
    initialBalanceB -= BigInt(price);
    expect(finalBalance).to.equal(initialBalanceB);
    // Ensure the seller's balance has increased by the NFT price
    const sellerEndBalance = await usdt.balanceOf(accountA.address) - initialBalanceA;
    expect(sellerEndBalance).to.equal(price);
    // Ensure the NFT is now owned by the buyer
    expect(await myNft.ownerOf(0)).to.equal(accountB.address);
    // Ensure the Deal event is emitted
    /**
    const events = await market.queryFilter(market.filters.Deal(), 0, 'latest');: 
    使用 Hardhat 的 queryFilter 方法检索最近触发的 Deal 事件。该方法返回一个事件对象数组，其中包含了所有匹配的事件。
    expect(events.length).to.equal(1);: 确保只有一个 Deal 事件被触发。如果长度不等于 1，说明有错误。
    expect(events[0].args.seller).to.equal(accountA.address);: 确保事件中的卖家地址与期望的 accountA 地址相匹配。
    expect(events[0].args.buyer).to.equal(accountB.address);: 确保事件中的买家地址与期望的 accountB 地址相匹配。
    expect(events[0].args.tokenId).to.equal(0);: 确保事件中的代币 ID 与期望的值相匹配。在这里，期望的是购买的 NFT 的代币 ID 为 0。
    expect(events[0].args.price).to.equal(price);: 确保事件中的价格与之前设置的 price 相匹配。这是为了验证买家支付的价格与事件中记录的价格一致。
     */
    const events = await market.queryFilter(market.filters.Deal(), 0, 'latest');
    expect(events.length).to.equal(1);
    expect(events[0].args.seller).to.equal(accountA.address);
    expect(events[0].args.buyer).to.equal(accountB.address);
    expect(events[0].args.tokenId).to.equal(0);
    expect(events[0].args.price).to.equal(price);
  });
})