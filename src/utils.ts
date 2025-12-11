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
}

export const getHtml = async (url: URL): Promise<IHtmlResponse> => {
  let serverIp: string | undefined;
  let html = await axios.get(url.href, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36',
      referer: url.origin,
      host: url.host
    },
    timeout: 5000,
    responseType: 'arraybuffer',
  }).then(res => {
    serverIp = res.request?.socket?.remoteAddress;
    return res.data;
  }).catch((e) => {
    return '';
  });

  if (!html) {
    return { html: '', serverIp }
  }

  let htmlStr = html.toString();
  if (htmlStr.includes("charset=gbk")) {
    htmlStr = iconv.decode(html, 'gbk');
  }
  return { html: htmlStr.replace(/(\n|\r)/g, ' '), serverIp };
}