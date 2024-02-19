import { allEngine } from "./engine";
import { BasePage } from "./engine/base";
import { IPageInfo, IPageInfoOptions } from "./interface";
export * from './interface';

export const getPageInfo = async (url: string, options: IPageInfoOptions = {}): Promise<IPageInfo> => {
  const defaultInfo: IPageInfo = {
    title: '',
    desc: '',
    url,
  };
  let urlInfo: URL;
  try {
    urlInfo = new URL(url)
  } catch {
    return defaultInfo;
  }
  
  const EngineClass = allEngine.find(engine => {
    return Array.isArray(engine.pageHost) ? engine.pageHost.includes(urlInfo.host) : engine.pageHost === urlInfo.host;
  }) || BasePage;
  const engine = new EngineClass(urlInfo);
  await engine.getPage();
  const baseInfo = engine.getBaseInfo();
  Object.assign(defaultInfo, baseInfo);
  if (options.author !== false) {
    defaultInfo.author = engine.getAuthorInfo();
  }
  if (options.content !== false) {
    defaultInfo.main = engine.getContentInfo();
  }
  return defaultInfo;
}