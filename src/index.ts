import { allEngine } from "./engine";
import { BasePage } from "./engine/base";
import { IPageInfo, IPageInfoOptions } from "./interface";

export const getPageInfo = async (link: string, options: IPageInfoOptions = {}): Promise<IPageInfo> => {
  const defaultInfo: IPageInfo = {
    title: '',
    desc: '',
    link,
  };
  let url: URL;
  try {
    url = new URL(link)
  } catch {
    return defaultInfo;
  }
  const EngineClass = allEngine.find(engine => {
    return Array.isArray(engine.pageHost) ? engine.pageHost.includes(url.host) : engine.pageHost === url.host;
  }) || BasePage;
  const engine = new EngineClass(url);
  await engine.getPage();
  const baseInfo = engine.getBaseInfo();
  Object.assign(defaultInfo, baseInfo);
  if (options.userInfo) {
    defaultInfo.user = engine.getUserInfo();
  }
  if (options.contentInfo) {
    defaultInfo.content = engine.getContentInfo();
  }
  return defaultInfo;
}