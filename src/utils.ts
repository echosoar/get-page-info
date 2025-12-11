import axios from 'axios';
import * as iconv from 'iconv-lite';
export const regExecResult = (regList: RegExp | RegExp[], content: string, index: string | number = 1, defaultValue = ''): string => {
  const regs = [].concat(regList || []);
  if (typeof index === 'string') {
    defaultValue = index;
    index = 1;
  }
  for(const reg of regs) {
    const res = reg.exec(content);
    if (res && res[index]) {
      return res[index];
    }
  }
  return defaultValue
}
export const omitText = (text: string, length = 100) => {
  const output = (text || '').length > length && text.slice ? (text.slice(0, length) + '...') : text;
  return output.replace(/\r/g, '').replace(/\s+/g, ' ').trim();
}


export interface IHtmlResponse {
  html: string;
  serverIp?: string;
  status: number;
}

export const getHtml = async (url: URL): Promise<IHtmlResponse> => {
  let serverIp: string | undefined;
  let status = 200;
  let html = await axios.get(url.href, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
      referer: url.origin,
      'accept-encoding': 'gzip',
      'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7,ru;q=0.6',
      host: url.host
    },
    timeout: 10000,
    responseType: 'arraybuffer',
  }).then(res => {
    status = res.status;
    // Extract server IP with error handling
    // Note: This relies on internal axios/node implementation and may not be available in all environments
    try {
      serverIp = res.request?.socket?.remoteAddress;
    } catch (e) {
      // serverIp remains undefined if extraction fails
    }
   
    return res.data;
  }).catch((e) => {
    status = e.response?.status || 500;
    return '';
  });

  if (!html) {
    return { html: '', serverIp, status }
  }

  let htmlStr = html.toString();
  if (htmlStr.includes("charset=gbk")) {
    htmlStr = iconv.decode(html, 'gbk');
  }
  return { html: htmlStr.replace(/(\n|\r)/g, ' '), serverIp, status };
}