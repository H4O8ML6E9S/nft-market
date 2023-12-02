// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/interfaces/IERC20.sol";
// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/interfaces/IERC721.sol";

import "@openzeppelin/contracts/interfaces/IERC721.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";

contract Market {
    IERC20 public erc20; //不写成address是为了以后可以直接调用合约的方法,不用显示转换
    IERC721 public erc721; //不写成address是为了以后可以直接调用合约的方法,不用显示转换

    //用户上架NTF过程中，hook钩子验证的一个验证码（类似于）
    bytes4 internal constant MAGIC_ON_ERC721_RECEIVED = 0x150b7a02;

    struct Order {
        address seller;
        uint256 tokenId;
        uint256 price;
    }
    /*将每个tokenId（非同质代币的唯一标识符）映射到一个 Order 结构。
      举例说明：如果某个用户想要出售自己的非同质代币,他会创建一个 Order 结构,
      然后将其与相应的 tokenId 关联。
      其他用户可以查询 orderOfId 来查看与特定 tokenId 相关联的订单。 */
    mapping(uint256 => Order) public orderOfId; //token id to order
    /**
      如果有多个用户分别出售不同的非同质代币,
      这些订单将存储在 orders 数组中,
      以便买家可以查看所有可用的订单。 */
    Order[] public orders;
    /**
    将每个 tokenId 映射到相应的订单在 orders 数组中的索引位置。
    这是为了方便后续对数组中订单的快速访问
    
    当一个新订单被创建并添加到 orders 数组时,
    idToOrderIndex 将被更新,使得可以通过 tokenId 快速找到订单在数组中的位置 */
    mapping(uint256 => uint256) public idToOrderIndex; // token id to index in orders

    event Deal(address seller, address buyer, uint256 tokenId, uint256 price);
    event NewOrder(address seller, uint256 tokenId, uint256 price);
    event PriceChanged(
        address seller,
        uint256 tokenId,
        uint256 previousPrice,
        uint256 price
    );
    event OrderCancelled(address seller, uint256 tokenId);

    constructor(address _erc20, address _erc721) {
        require(_erc20 != address(0), "zero address");
        require(_erc721 != address(0), "zero address");
        erc20 = IERC20(_erc20);
        erc721 = IERC721(_erc721);
    }

    function buy(uint256 _tokenId) external {
        address seller = orderOfId[_tokenId].seller;
        address buyer = msg.sender;
        uint256 price = orderOfId[_tokenId].price;
        require(
            erc20.transferFrom(buyer, seller, price),
            "transfer not successful"
        ); //存在返回值的隐藏坑
        erc721.safeTransferFrom(address(this), buyer, _tokenId);
        removeOrder(_tokenId);
        emit Deal(seller, buyer, _tokenId, price);
    }

    function cancelOrder(uint256 _tokenId) external {
        address seller = orderOfId[_tokenId].seller;
        require(msg.sender == seller, "not seller");
        erc721.safeTransferFrom(address(this), seller, _tokenId);
        removeOrder(_tokenId);
        emit OrderCancelled(seller, _tokenId);
    }

    function changePrice(uint256 _tokenId, uint256 _price) external {
        address seller = orderOfId[_tokenId].seller;
        require(msg.sender == seller, "not seller");
        uint256 previousPrice = orderOfId[_tokenId].price;
        //修改orderOfId里的价格
        orderOfId[_tokenId].price = _price;
        //修改order里的价格
        Order storage order = orders[idToOrderIndex[_tokenId]];
        order.price = _price;
        emit PriceChanged(seller, _tokenId, previousPrice, _price);
    }

    /**
        要删除的元素与最后一个元素交换
     */
    function removeOrder(uint256 _tokenId) internal {
        uint256 index = idToOrderIndex[_tokenId];
        uint256 lastIndex = orders.length - 1;
        if (index != lastIndex) {
            Order storage lastOrder = orders[lastIndex];
            orders[index] = lastOrder;
            idToOrderIndex[lastOrder.tokenId] = index;
        }
        orders.pop();
        delete orderOfId[_tokenId];
        delete idToOrderIndex[_tokenId];
    }

    /**
      hook钩子，调用safeTransFrom会验证to地址是不是合约地址，若为合约地址，就会尝试调用onERC721Received方法，并且要求返回值为之前约定好的值（Bytes4）。
      用户在调用NTF market（合约地址）的safeTransFrom，就会有个钩子自动调用onERC721Received。我们就需要再onERC721Received完成帮助用户上架NTF的功能。
      用户和market两头是有个对接的，我们将价格以bytes4编码到safeTransFrom的data属性里去，market会自动解析为unit256的形式并上架  */
    //有了这个方法,NTF才能安全的被传送到_to地址
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4) {
        uint256 price = toUint256(data, 0);
        require(price > 0, "price must be greater than 0");
        //上架
        orders.push(Order(from, tokenId, price));
        orderOfId[tokenId] = Order(from, tokenId, price);
        idToOrderIndex[tokenId] = orders.length - 1;
        emit NewOrder(from, tokenId, price);
        return MAGIC_ON_ERC721_RECEIVED;
    }

    function toUint256(bytes memory _bytes, uint256 _start)
        public
        pure
        returns (uint256)
    {
        require(_start + 32 >= _start, "Market:toUint256_overflow");
        require(_bytes.length >= _start + 32, "Market: toUint256_out0fBounds");
        uint256 tempUint;
        assembly {
            tempUint := mload(add(add(_bytes, 0x20), _start))
        }
        return tempUint;
    }

    function isListed(uint256 _tokenId) public view returns (bool) {
        return orderOfId[_tokenId].seller != address(0);
    }

    function getOrderLength() external view returns (uint256) {
        return orders.length;
    }

    function getAllNFTs() external view returns (Order[] memory) {
        return orders;
    }

    /**
        如果没被上架，那么格式就如下，地址为0 
        tuple(address,uint256,uint256)[]: 0x0000000000000000000000000000000000000000,0,0
     */
    function getMyNFTs() external view returns (Order[] memory) {
        Order[] memory myOrders = new Order[](orders.length);
        uint256 count = 0;
        for (uint256 i = 0; i < orders.length; i++) {
            if (orders[i].seller == msg.sender) {
                myOrders[count] = orders[i];
                count++;
            }
        }
        return myOrders;
    }
}
