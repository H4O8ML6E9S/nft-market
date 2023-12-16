**建议一切测试都在<u>谷歌浏览器</u>上!!!**

**项目启动过程：**

- **先部署好三个合约，并修改前后端的.env文件!!!**
- **后端的nft-minter.js可选择要不要上架nft**

- **nodemon ./app.js ##启动服务器  8088端口**
- **ipfs daemon ##启动 ipfs  8080端口**
- **npm start ##启动react项目   3000端口**
- **npx hardhat node ##启动链上节点**

**项目操作过程：**

- **查看nft市场 为空**

![](.\README.assets\image-20231216172237671.png)

- 查看个人拥有的nft数量

![](.\README.assets\image-20231216172903256.png)

- 上架操作 **<u>有报错不要慌，等node交易成功就行，这个bug不知道怎么解决</u>**

![](.\README.assets\image-20231216173017354.png)

![](.\README.assets\image-20231216173050051.png)

- 下架操作  **<u>有报错不要慌，等node交易成功就行，这个bug不知道怎么解决</u>**

![](.\README.assets\image-20231216173301576.png)

- 购买操作  **<u>有报错不要慌，等node交易成功就行，这个bug不知道怎么解决</u>**

![](.\README.assets\image-20231216175912832.png)

- **存在的bug：账户写死了，只能是**

**REACT_APP_USER=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266**

## 未结合react版 NFT后端

记得配置 ipfs 和 ipfsdata 的环境变量！

npm run start ##启动服务器 不用了
nodemon ./app.js ##启动服务器
npx hardhat node ##启动 hardhat 节点
ipfs init --profile server ##初始化 ipfs
ipfs daemon ##启动 ipfs
http://localhost:8080/ipfs/cid ##查看当前上传的图片
remixd -s "D:\code\nft-teachers" --remix-ide "https://remix.ethereum.org" ##启动 remixd

## 结合react版  NFT前端

npm install -g create-react-app ##安装 create-react-app
create-react-app -V // 注意：V 是大写的 检测 create-react-app 是否安装成功
npx create-react-app react_nft ##创建react项目
npm start ##启动react项目   

## 前端交互接口设计

合约地址
MyNFT: 0x5FbDB2315678afecb367f032d93F642f64180aa3
cUSDT: 0x84eA74d481Ee0A5332c457a4d796187F6Ba67fEB
Market: 0x9E545E3C0baAB3E08CdfD552C960A1050f373042

备注：不同环境部署出来的合约地址可能不一样，以实际为准

### 购买NFT
0. 查询allowance, 如果为0或者不足，先调用approve
1. 调用 erc20.approve(spender, amount) 批准Market合约转币；
2. 调用 market.buy(tokenId) 购买；

### 挖NFT

前端上传图片，其他步骤在后端完成：
1. 图片上传到 IPFS 并返回 CID；
2. 生成 Metadata 并返回 CID；
3. Mint NFT给用户；

### 改价格

调用 market.changePrice(tokenId, price)

### 下架

调用 market.cancelOrder(tokenId)

### 查询市场所有NFT

调用 market.getAllNFTs()
调用 nft.token(URI)

### 查询个人所有NFT

调用 market.getMyNFTs()
调用 erc721.balanceOf(address)
调用 erc721.tokenOfOwnerByIndex(owner, index)
调用 erc721.tokenURI(tokenId)
