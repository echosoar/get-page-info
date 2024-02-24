import assert from 'assert';
import { getPageInfo } from '../src';
describe('index.test.ts', () => {
  it('blog.csdn.net', async () => {
    const url = 'https://blog.csdn.net/ccsss22/article/details/127582230';
    const info = await getPageInfo(url);
    assert(info.title.includes('MATLAB'));
    assert(info.desc.includes('指纹图像'));
    assert(info.url === url);
    assert(info.favicon === 'https://blog.csdn.net/favicon.ico');
  });
  it('www.dgtle.com', async () => {
    const url = 'https://www.dgtle.com/inst-1845232-1.html';
    const info = await getPageInfo(url);
    assert(info.title.includes('卡塔尔世界杯'));
    assert(info.desc.includes('东道主'));
    assert(info.url === url);
    assert(info.favicon === 'https://www.dgtle.com/favicon.ico');
  });
  it('https://explorer.globe.engineer/', async () => {
    const url = 'https://explorer.globe.engineer/';
    const info = await getPageInfo(url);
    assert(info.favicon === 'https://explorer.globe.engineer/favicon.png');
  });
  it('https://www.zhihu.com', async () => {
    const url = 'https://www.zhihu.com/question/538449801/answer/3373318638';
    const info = await getPageInfo(url);
    assert(info.favicon === 'https://static.zhihu.com/heifetz/favicon.ico');
    assert(info.title.includes('顶级享受'));
    expect(!!info.desc).toBeTruthy();
  });
  it('https://toolight.cn/', async () => {
    const url = 'https://toolight.cn/';
    const info = await getPageInfo(url);
    assert(info.favicon === 'https://cdn.1htr.cn/images/toolighticon.png');
    assert(info.title.includes('偷懒工具'));
    assert(info.desc.includes('为您的工作生活加油添瓦'));
  });
});