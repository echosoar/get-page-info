import { IPageContentInfo, IPageUserInfo } from "../interface";
import { BasePage } from "./base";

// 百度百家号
export class BaiduBaijiahao extends BasePage {
  static pageHost = 'baijiahao.baidu.com';
  static pageName = '百度百家号';
  getUserInfo(): IPageUserInfo {
    const userReg = /<a href="https:\/\/author.baidu.com\/home[^>]*><img src="([^"]*)"><\/a>.*?(<i\s).*?<p class="[\w_]+">(.*?)<\/p><\/a><div class="[\w_]+"><span class="[\w_]+">(\d{4}-\d{2}-\d{2} \d{2}:\d{2})<\/span>/;
    const res = userReg.exec(this.html);
    if (!res) {
      return {}
    }
    return {
      name: res[3],
      headimg: res[1],
      verified: !!res[2],
    }
  }
  getContentInfo(): IPageContentInfo {
    const userReg = /<span class="[\w_]+">(\d{4}-\d{2}-\d{2} \d{2}:\d{2})<\/span>/;
    const res = userReg.exec(this.html);
    if (!res) {
      return {}
    }
    return {
      time: +new Date(res[1])
    }
  }
}