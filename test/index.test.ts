import assert from 'assert';
import { getPageInfo } from '../src';
describe('index.test.ts', () => {
  it.only('blog.csdn.net', async () => {
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
    assert(info.title.includes('1卡塔尔世界杯'));
    assert(info.desc.includes('东道主'));
    assert(info.url === url);
    assert(info.favicon === 'https://www.dgtle.com/favicon.ico');
  });
});