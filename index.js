// 广告：陈一发儿 2023 直播导航：67373.net
let exp = module.exports;
/*✳️ 比较适合中文的文件名合法化：
  1、将 Reserved characters (/, ?, <, >, \, :, *, |, and ")换成全角；
  2、将 \n \r 换成全角＼；
  3、最后交给第三方的 sanitize-filename 处理：https://www.npmjs.com/package/sanitize-filename */
const sanitizeFilename = require("sanitize-filename")
exp.goodFilename = function (str) {
  const mapping = {
    '/': '／', '?': '？', '<': '＜', '>': '＞', '\\': '＼', ':': '：', '*': '＊', '|': '｜', '"': '＂'
  };
  str = str
    .replace(/[\/?<>\\:*|"]/g, char => { return mapping[char]; })
    .replace(/[\n\r]/g, '＼')
    .trim();
  return sanitizeFilename(str);
};
/* ✳️ formatTime 返回特定时区的格式时间。*/
/*  ← 默认：2023年02月06日[周一]16:26:56.918 */
/*  ← 230206一 formatTime({style: '[YY][MM][DD][xq]'}); */
/*  ← 230206_163021 formatTime({style: '[YY][MM][DD]_[hh][mm][ss]'}); */
/*  ← 23-02-06 一 16:23:12 formatTime({style: '[YY]-[MM]-[DD] [xq] [hh]:[mm]:[ss]'}) */
exp.formatTime = function (params = {}) {
  let { timeZone = 8,
    dateNum = Date.now(),
    style = '[YYYY]年[MM]月[DD]日[[xqxq]][hh]:[mm]:[ss].[msms]'
  } = params;
  let xingQiKey = { "0": "日", "1": "一", "2": "二", "3": "三", "4": "四", "5": "五", "6": "六" };
  dateNum = Number(new Date(dateNum));
  let a = new Date(dateNum +
    (parseInt((new Date(dateNum)).getTimezoneOffset() / 60) + timeZone) * 3600 * 1000);
  let pair = [
    [/\[YYYY\]/g, a.getFullYear()], [/\[YY\]/g, String(a.getFullYear()).slice(-2)],
    [/\[MM\]/g, ('0' + (a.getMonth() + 1)).slice(-2)], [/\[M\]/g, (a.getMonth() + 1)],
    [/\[DD\]/g, ('0' + a.getDate()).slice(-2)], [/\[D\]/g, a.getDate()],
    [/\[xqxq\]/g, '周' + xingQiKey[a.getDay()]], [/\[xq\]/g, xingQiKey[a.getDay()]],
    [/\[hh\]/g, ('0' + a.getHours()).slice(-2)], [/\[h\]/g, a.getHours()],
    [/\[mm\]/g, ('0' + a.getMinutes()).slice(-2)], [/\[m\]/g, a.getMinutes()],
    [/\[ss\]/g, ('0' + a.getSeconds()).slice(-2)], [/\[s\]/g, a.getSeconds()],
    [/\[msms\]/g, ('00' + a.getMilliseconds()).slice(-3)], [/\[ms\]/g, a.getMilliseconds()]
  ];
  pair.forEach(item => style = style.replaceAll(item[0], item[1]));
  return style;
};
/* ✳️ 等待毫秒 */
exp.wait = async function (ms = 1000) {
  return new Promise((resolve, reject) => {
    setTimeout(() => { resolve(ms) }, ms)
  })
};