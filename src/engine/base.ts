import { IPageBaseInfo, IPageMainContentInfo, IPageAuthorInfo } from "../interface";
import { getHtml, regExecResult } from "../utils";

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
  getBaseInfo(): Partial<IPageBaseInfo> {
    const titleReg = /<title>([^<]*?)<\/title>/i;
    const descReg = /<meta\s+name="description"\s+content="([^"]*)"/i;
    return {
      title: regExecResult(titleReg, this.html),
      desc: regExecResult(descReg, this.html),
      favicon:  this.getFavicon(),
    }
  }
  getAuthorInfo(): IPageAuthorInfo {
    return {}
  }
  getContentInfo(): IPageMainContentInfo {
    return {
      content: this.getContent(),
    }
  }

  private getFavicon(): string {
    const favicon = regExecResult(/<link\s+rel="icon"\s+href="([^"]+)"/, this.html);
    return favicon || `${this.url.origin}/favicon.ico`
  }

  private getContent(): string {
    let bodyInfo = /<body(\s+[^>]*)?>(.*)<\/body>/i.exec(this.html);
    if (!bodyInfo || !bodyInfo[2]) {
      return '';
    }
    let content = bodyInfo[2];
    content = content.replace(/<script(\s+[^>]*)?>.*?<\/script>/g, '')
    content = content.replace(/<header(\s+[^>]*)?>.*?<\/header>/g, '')
    content = content.replace(/<footer(\s+[^>]*)?>.*?<\/footer>/g, '')
    content = content.replace(/<form(\s+[^>]*)?>.*?<\/form>/g, '')
    content = content.replace(/<style(\s+[^>]*)?>.*?<\/style>/g, '')
    content = content.replace(/<textarea(\s+[^>]*)?>.*?<\/textarea>/g, '')
    if (content.includes('<article')) {
      let articleInfo = /<article(\s+[^>]*)?>(.*)<\/article>/i.exec(this.html);
      if (articleInfo && articleInfo[2]) {
        content = articleInfo[2];
      }
    }
    let pMatched;
    const contentList = [];
    let pReg = /<p(\s+[^>]*)?>(.*?)<\/p>/g;
    while(pMatched =pReg.exec(content)) {
      let content = pMatched[2];
      content = content.replace(/<[^>]*>/g, '');
      content = content.trim();
      if (!content) {
        continue;
      }
      contentList.push(content);
    }
    return contentList.join('\n');
  }
}