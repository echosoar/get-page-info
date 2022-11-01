import assert from 'assert';
import { getPageInfo } from '../src';
describe('index.test.ts', () => {
  it('blog.csdn.net', async () => {
    const link = 'https://blog.csdn.net/ccsss22/article/details/127582230';
    const info = await getPageInfo(link);
    assert(info.title.includes('MATLAB'));
    assert(info.desc.includes('指纹图像'));
    assert(info.link === link);
    assert(info.favicon === 'https://blog.csdn.net/favicon.ico');
  });
  it('www.dgtle.com', async () => {
    const link = 'https://www.dgtle.com/inst-1845232-1.html';
    const info = await getPageInfo(link);
    assert(info.title.includes('卡塔尔世界杯'));
    assert(info.desc.includes('东道主'));
    assert(info.link === link);
    assert(info.favicon === 'https://www.dgtle.com/favicon.ico');
  });
  it('baijiahao.baidu.com', async () => {
    const link = 'https://baijiahao.baidu.com/s?id=1748274220373645890&wfr=spider&for=pc';
    const info = await getPageInfo(link, { userInfo: true, contentInfo: true });
    assert(info.title === '颜宁即将全职回国，出任深圳医学科学院创始院长');
    assert(info.user.name === '文汇报');
    assert(info.user.headimg);
    assert(info.user.verified);
  });
});