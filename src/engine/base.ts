import { IPageBaseInfo, IPageMainContentInfo, IPageAuthorInfo } from "../interface";
import { getHtml, regExecResult, IHtmlResponse } from "../utils";

export class BasePage {
  static pageName: string = '';
  static pageHost: string | string[] = '';
  protected url: URL;
  protected html = '';
  protected serverIp?: string;
  constructor(url: URL) {
    this.url = url;
  }

  async getPage() {
    const response: IHtmlResponse = await getHtml(this.url);
    this.html = response.html;
    this.serverIp = response.serverIp;
  }
  getBaseInfo(): Partial<IPageBaseInfo> {
    const titleReg = /<title[^>]*>([^<]*?)<\/title>/i;
    const descReg = /<meta[^>]*\s+name="description"[^>]*\s+content="([^"]*)"/i;
    return {
      title: regExecResult(titleReg, this.html),
      desc: regExecResult(descReg, this.html),
      favicon:  this.getFavicon(),
      cover: this.getCoverImage(),
      keywords: this.getKeywords(),
      serverIp: this.serverIp,
    }
  }
  getAuthorInfo(): IPageAuthorInfo {
    return {}
  }
  getContentInfo(): IPageMainContentInfo {
    return {
      content: this.getContent(),
      time: this.getTime(),
    }
  }

  private getFavicon(): string {
    let favicon = regExecResult([
      /<link\s+rel="icon"\s+href="([^"]+)"/,
      /<link[^>]*\s+rel="(?:shortcut|icon|\s)*"[^>]*\s+href="([^"]+)"/,
    ], this.html);
    favicon = favicon || `${this.url.origin}/favicon.ico`
    if (favicon.startsWith('//')) {
      favicon = this.url.protocol + favicon;
    } else if (favicon.startsWith('/')) {
      favicon = this.url.origin + favicon;
    } else if (favicon.startsWith('.')) {
      // Use URL constructor for proper path resolution
      try {
        favicon = new URL(favicon, this.url.href).href;
      } catch {
        favicon = this.url.origin + '/favicon.ico';
      }
    }
    return favicon;
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

  private getKeywords(): string {
    // Handle both attribute orders: name-content and content-name
    const keywordsReg = [
      /<meta[^>]*\s+name="keywords"[^>]*\s+content="([^"]*)"/i,
      /<meta[^>]*\s+content="([^"]*)"[^>]*\s+name="keywords"/i,
    ];
    return regExecResult(keywordsReg, this.html);
  }

  private getCoverImage(): string {
    // Priority 1: og:image and similar meta tags
    let cover = regExecResult([
      /<meta[^>]*\s+property="og:image"[^>]*\s+content="([^"]+)"/i,
      /<meta[^>]*\s+name="twitter:image"[^>]*\s+content="([^"]+)"/i,
      /<meta[^>]*\s+itemprop="image"[^>]*\s+content="([^"]+)"/i,
    ], this.html);

    // Priority 2: First img tag in HTML
    if (!cover) {
      cover = regExecResult(/<img[^>]*\s+src="([^"]+)"/i, this.html);
    }

    // Priority 3: Preload images
    if (!cover) {
      cover = regExecResult(/<link[^>]*\s+rel="preload"[^>]*\s+as="image"[^>]*\s+href="([^"]+)"/i, this.html);
    }

    // Priority 4: Background CSS images
    if (!cover) {
      cover = regExecResult(/background(?:-image)?\s*:\s*url\(['"]?([^'")]+)['"]?\)/i, this.html);
    }

    if (!cover) {
      return '';
    }

    // Normalize URL
    if (cover.startsWith('//')) {
      cover = this.url.protocol + cover;
    } else if (cover.startsWith('/')) {
      cover = this.url.origin + cover;
    } else if (cover.startsWith('.')) {
      // Use URL constructor for proper path resolution
      try {
        cover = new URL(cover, this.url.href).href;
      } catch {
        cover = this.url.origin + '/' + cover;
      }
    } else if (!cover.startsWith('http')) {
      cover = this.url.origin + '/' + cover;
    }
    
    return cover;
  }

  private getTime(): number | undefined {
    // Try to extract time from various meta tag formats
    const timeStr = regExecResult([
      /<meta[^>]*\s+property="article:published_time"[^>]*\s+content="([^"]+)"/i,
      /<meta[^>]*\s+property="og:updated_time"[^>]*\s+content="([^"]+)"/i,
      /<meta[^>]*\s+property="article:modified_time"[^>]*\s+content="([^"]+)"/i,
      /<meta[^>]*\s+name="pubdate"[^>]*\s+content="([^"]+)"/i,
      /<meta[^>]*\s+name="publishdate"[^>]*\s+content="([^"]+)"/i,
      /<meta[^>]*\s+itemprop="datePublished"[^>]*\s+content="([^"]+)"/i,
      /<meta[^>]*\s+itemprop="dateModified"[^>]*\s+content="([^"]+)"/i,
    ], this.html);

    if (!timeStr) {
      return undefined;
    }

    // Try to parse the time string
    const timestamp = new Date(timeStr).getTime();
    return isNaN(timestamp) ? undefined : timestamp;
  }
}