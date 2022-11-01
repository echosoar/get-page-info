import { IPageBaseInfo, IPageContentInfo, IPageUserInfo } from "../interface";
import { omitText, regExecResult } from "../utils";
import axios from 'axios';
import * as iconv from 'iconv-lite';

export class BasePage {
  static pageName: string = '';
  static pageHost: string | string[] = '';
  protected url: URL;
  protected html = '';
  constructor(url: URL) {
    this.url = url;
  }

  async getPage() {
    this.html = await getHtml(this.url)
  }
  getBaseInfo(): IPageBaseInfo {
    const titleReg = /<title>([^<]*?)<\/title>/i;
    const descReg = /<meta\s+name="description"\s+content="([^"]*)"/i;
    return {
      title: omitText(regExecResult(titleReg, this.html), 50),
      desc: omitText(regExecResult(descReg, this.html)),
      favicon: `${this.url.origin}/favicon.ico`,
    }
  }
  getUserInfo(): IPageUserInfo {
    return {}
  }
  getContentInfo(): IPageContentInfo {
    return {}
  }
}


const getHtml = async (url: URL) => {
  let html = await axios.get(url.href, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36',
      referer: url.origin,
      host: url.host
    },
    timeout: 5000,
    responseType: 'arraybuffer',
  }).then(res => res.data).catch((e) => {
    return '';
  });

  if (!html) {
    return ''
  }

  let htmlStr = html.toString();
  if (htmlStr.includes("charset=gbk")) {
    htmlStr = iconv.decode(html, 'gbk');
  }
  return htmlStr.replace(/\n/g, ' ');
}