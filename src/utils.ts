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