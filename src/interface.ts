export interface IPageBaseInfo {
  url: string;
  title: string;
  desc: string;
  favicon?: string;
}

export interface IPageInfo extends IPageBaseInfo {
  main?: IPageMainContentInfo;
  author?: IPageAuthorInfo;
}

export interface IPageMainContentInfo {
  content: string;
  cover?: string;
  time?: number;
}
export interface IPageAuthorInfo {
  nick?: string;
  account?: string;
  cover?: string;
  verified?: boolean;
}

export interface IPageInfoOptions {
  userInfo?: boolean;
  contentInfo?: boolean;
}