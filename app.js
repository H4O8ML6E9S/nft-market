/*
 * @Author: 南宫
 * @Date: 2023-12-05 17:41:13
 * @LastEditTime: 2023-12-08 19:36:39
 */
/**
 * express 一种web框架，用于启动服务器
 * ejs 一种语法，类似于HTML
 * 中间件：
 * nodemon 一种托管项目的工具，修改代码后就不用来回重启项目了
 * body-parser 获取用户前端页面传过来的参数 通过req.body获取
 * express-fileupload 处理上传的图片
 * kubo-rpc-client 启动服务器 
 * dotenv 配置总体环境变量
 */
import express from 'express';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import { mint } from './nft-minter.js'
import { uploadFileToIPFS, uploadJSONToIPFS } from './ipfs-uploader.js';
import dotenv from 'dotenv';
dotenv.config("./.env");

const app = express();
app.set('view engine', 'ejs'); //使用ejs模板引擎
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

app.get('/', (req, res) => {
  // res.send('Hello world !'); 
  res.render("home")
});

app.post('/upload', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ message: 'No files were uploaded.' });
  }
  /**这两个变量的t和d是与前端input框的name属性值相对应 */
  const title = req.body.title;
  const description = req.body.description;
  const address = req.body.address

  const file = req.files.file;//用express-fileupload处理的
  const filename = file.name;
  const filePath = "files/" + filename;

  /**1.将用户上传的图片转移到本地存储起来，后面再传递给IPFS */
  file.mv(filePath, async (err) => {
    if (err) {
      console.log(err);
      res.status(500).send("error occured"); //500后端处理失败
    }
    /**2.上传本地文件到IPFS */
    const fileResult = await uploadFileToIPFS(filePath);
    const fileCid = fileResult.cid.toString();

    const metadata = {
      title: title,
      description: description,
      image: process.env.IPFS_NET + fileCid
    }

    const metadataResult = await uploadJSONToIPFS(metadata);
    const metadataCid = metadataResult.cid.toString();
    console.log(metadataCid);

    // 给用户挖一个NFT
    const userAddress = address || process.env.ADDRESS;
    await mint(userAddress, process.env.IPFS_NET + metadataCid)

    res.json({
      message: "file upload sucessfully!!",
      data: metadata
    }
    )
  })
});

app.listen(8088, () => {
  console.log('Example app listening on port 8088!');
});
