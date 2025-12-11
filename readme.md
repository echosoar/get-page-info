<p align="center">
  <br/>
  <br/>
  <b>get-page-info</b>
  <br />
  <br />
  <span>Quickly get the main information from the URL.</span>
  <br />
  <br />
  <span>
    <a href="https://www.npmjs.org/package/get-page-info"><img src="https://img.shields.io/npm/v/get-page-info.svg?style=flat" alt="npm"></a> 
    <a href="./LICENSE" alt="GitHub license">
      <img src="https://img.shields.io/badge/license-MIT-blue.svg" />
    </a>
    <a href="https://github.com/echosoar/get-page-info/actions?query=workflow%3A%22Node.js+CI%22" alt="Node.js CI">
      <img src="https://img.shields.io/badge/Node.js%20CI-passing-brightgreen" />
    </a>
  </span>
  <br />
</p>

## Install
```shell
$ npm i get-page-info --save
```

## Usage
```typescript
import { getPageInfo, IPageInfoOptions } from 'get-page-info';
const info = await getPageInfo('https://www.baidu.com/', {} as IPageInfoOptions);
console.log(info);
/*
{
  "title": "百度一下，你就知道",
  "desc": "全球领先的中文搜索引擎、致力于让网民更便捷地获取信息，找到所求。百度超过千亿的中文网页数据库，可以瞬间找到相关的搜索结果。",
  "url": "https://www.baidu.com/",
  "favicon": "https://www.baidu.com/favicon.ico",
  "cover": "https://www.baidu.com/img/bd_logo1.png",
  "keywords": "百度,搜索引擎,baidu",
  "serverIp": "110.242.68.3",
  "author": {},
  "main": {
    "content": "关于百度\nAbout Baidu\n使用百度前必读\n帮助中心\n企业推广\n京公网安备11000002000001号\n京ICP证030173号\n互联网新闻信息服务许可证11220180008\n网络文化经营许可证： 京网文〔2023〕1034-029号\n信息网络传播视听节目许可证 0110516\n互联网宗教信息服务许可证编号：京（2022）0000043\n药品医疗器械网络信息服务备案（京）网药械信息备字（2021）第00159号\n医疗器械网络交易服务第三方平台备案凭证（京）网械平台备字（2020）第00002号\n&#169;2024&nbsp;Baidu&nbsp;",
    "time": 1702222200000
  }
}
*/
```

### options: IPageInfoOptions
```typescript
export interface IPageInfoOptions {
  // When set to false, author information is not parsed
  author?: boolean;
  // When set to false, content is not parsed
  content?: boolean;
}
```

## License
MIT