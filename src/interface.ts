export interface IPageBaseInfo {
  url: string;
  title: string;
  desc: string;
  favicon?: string;
  cover?: string;
  keywords?: string;
  serverIp?: string;
}

export interface IPageInfo extends IPageBaseInfo {
  main?: IPageMainContentInfo;
  author?: IPageAuthorInfo;
}

export interface IPageMainContentInfo {
  content: string;
  time?: number;
}
export interface IPageAuthorInfo {
  nick?: string;
  account?: string;
  cover?: string;
  verified?: boolean;
}

export interface IPageInfoOptions {
  author?: boolean;
  content?: boolean;
}