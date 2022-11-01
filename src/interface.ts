export interface IPageBaseInfo {
  title: string;
  desc: string;
  favicon?: string;
}

export interface IPageInfo extends IPageBaseInfo {
  link: string;
  content?: IPageContentInfo;
  user?: IPageUserInfo;
}

export interface IPageContentInfo {
  cover?: string;
  time?: number;
}
export interface IPageUserInfo {
  name?: string;
  account?: string;
  headimg?: string;
  verified?: boolean;
}

export interface IPageInfoOptions {
  userInfo?: boolean;
  contentInfo?: boolean;
}