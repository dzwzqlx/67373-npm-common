// 广告：陈一发儿 2023 直播导航：67373.net
let exp = module.exports;
const util = require('util');
const fs = require('fs');


/*✳️✳️✳️✳️✳️✳️✳️✳️
类似 console.log 的输出格式，参数间空格 */
exp.log = function () {
  let ret = [];
  for (let item of arguments) {
    if (typeof item === 'string') ret.push(item)
    else ret.push(util.inspect(item));
  };
  return ret.join(' ');
};
// for (let item of arguments) {
//   if (typeof item === 'object') { ret.push(util.inspect(item)); }
//   else { ret.push(item); }
// };
// console.log(...ret);

/*✳️✳️✳️✳️✳️✳️✳️✳️
类似 console.log 的输出格式，参数间换行 */
exp.log2 = function () {
  const options = {
    breakLength: Infinity,
    // compact: false
  };
  let ret = [];
  for (let item of arguments) {
    if (typeof item === 'string') ret.push(item)
    else ret.push(util.inspect(item, options));
  };
  return '\n' + ret.join('\n\n') + '\n';
};

/*✳️✳️✳️✳️✳️✳️✳️✳️
json 转为字符串，绕开了 JSON.stringify 循环报错 */
exp.jsonToStr = function (obj, params = {}) {
  let {
    indentation = 2,
    ignoreType = [] // ['string']
  } = params;
  const seen = new WeakSet();
  for (let item of ignoreType) {
    if (typeof (obj) == item) return obj;
  }
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) return '[Circular]';
      seen.add(value);
    };
    return value;
  }, indentation);
};

/*✳️✳️✳️✳️✳️✳️✳️✳️
生成数组 */
exp.arrAtoB = function (numA, numB, gap) {
  gap = gap || 1;
  let ret = [];
  for (let i = numA; i <= numB; i += gap) ret.push(i);
  return ret;
};

/*✳️✳️✳️✳️✳️✳️✳️✳️
promise 形式简单的终端输入，可设置倒计时默认答案*/
exp.clAsk = async function (question, defaultAnswer, timeout) {
  timeout = Number(timeout);
  return new Promise((resolve, reject) => {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    readline.question(question, (answer) => {
      resolve(answer);
      readline.close();
    });
    if (timeout) {
      setTimeout(() => {
        // console.log(a);
        resolve(defaultAnswer);
        readline.close();
      }, timeout);
    };
  })
};

/*✳️✳️✳️✳️✳️✳️✳️✳️
控制台倒计时*/
exp.countdown = function (seconds) {
  let remainingSeconds = Number(seconds);
  const intervalId = setInterval(() => {
    process.stdout.clearLine(0); // 清除当前行
    process.stdout.cursorTo(0); // 将光标移动到行的开始位置
    process.stdout.write(String(remainingSeconds)); // 在同一行输出倒计时数字
    remainingSeconds--;
    if (remainingSeconds < 0) {
      clearInterval(intervalId);
      process.stdout.write('\n'); // 输出换行符，完成倒计时
    }
  }, 1000);
  return (intervalId);
};

/*✳️✳️✳️✳️✳️✳️✳️✳️
比较适合中文的文件名合法化：
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

/*✳️✳️✳️✳️✳️✳️✳️✳️
formatTime 返回特定时区的格式时间。*/
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

/*✳️✳️✳️✳️✳️✳️✳️✳️
等待毫秒 */
exp.wait = async function (ms = 1000) {
  return new Promise((resolve, reject) => {
    setTimeout(() => { resolve(ms) }, ms)
  })
};

////////////////////////////////////////////////////////////////////////

/*✳️✳️✳️✳️✳️✳️✳️✳️
读取 JSON 文件 */
// exp.fileToJson = function (filePath) {
//   let jsonObj = fs.readFileSync(filePath, 'utf-8');
//   return JSON.parse(jsonObj);
// };