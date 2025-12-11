import assert from 'assert';
import { getPageInfo } from '../src';
describe('index.test.ts', () => {
  it('blog.csdn.net', async () => {
    const url = 'https://blog.csdn.net/ccsss22/article/details/127582230';
    const info = await getPageInfo(url);
    assert(info.title.includes('MATLAB'));
    assert(info.desc.includes('指纹'));
    assert(info.url === url);
    assert(info.favicon === 'https://blog.csdn.net/favicon.ico');
    assert(info.main?.content.includes('指纹识别系统主要涉及三大步骤'));
  });
  it('www.dgtle.com', async () => {
    const url = 'https://www.dgtle.com/inst-1845232-1.html';
    const info = await getPageInfo(url);
    assert(info.title.includes('卡塔尔世界杯'));
    assert(info.desc.includes('东道主'));
    assert(info.url === url);
    assert(info.favicon === 'https://www.dgtle.com/favicon.ico');
    assert(info.main?.content.includes('预测一波：卡塔尔世界杯阿根廷能否夺冠'));
  });
  it('https://explorer.globe.engineer/', async () => {
    const url = 'https://explorer.globe.engineer/';
    const info = await getPageInfo(url);
    assert(info.title === 'Explorer - AI Powered Discovery & Learning Engine');
    assert(info.favicon === 'https://explorer.globe.engineer/favicon.png');
  });
  it.skip('https://www.zhihu.com', async () => {
    const url = 'https://www.zhihu.com/question/538449801/answer/3373318638';
    const info = await getPageInfo(url);
    assert(info.favicon === 'https://static.zhihu.com/heifetz/favicon.ico');
    assert(info.title.includes('顶级享受'));
    expect(!!info.desc).toBeTruthy();
  });
  it('https://toolight.cn/', async () => {
    const url = 'https://toolight.cn/';
    const info = await getPageInfo(url);
    assert(info.title.includes('偷懒工具'));
  });
  it('https://www.fmprc.gov.cn/zyxw/202512/t20251205_11767576.shtml', async () => {
    const url = 'https://www.fmprc.gov.cn/zyxw/202512/t20251205_11767576.shtml';
    const info = await getPageInfo(url);
    assert(info.title.includes('中法关于农业和食品交流与合作的联合声明'));
    assert(info.main?.content.includes('中法两国承诺在符合双方法律法规以及世界贸易组织'));
  });
  it('https://github.com/echosoar/get-page-info', async () => {
    const url = 'https://github.com/echosoar/get-page-info';
    const info = await getPageInfo(url);
    assert(info.title.includes('echosoar/get-page-info'));
    assert(info.main?.content.includes('npm i get-page-info --save'));
  });
});