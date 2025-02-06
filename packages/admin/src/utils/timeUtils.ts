/* eslint-disable default-case */
//补0
const fillZero = function (val) {
  return (val < 10 ? '0' : '') + val;
};

// 转换时间格式 例如 yyyy-MM-dd
const timeFormat = function (val, format = 'yyyy-MM-dd') {
  let t = val ? new Date(val) : new Date();
  return format.replace(/yyyy|MM|dd|HH|mm|ss/g, (a) => {
    switch (a) {
      case 'yyyy':
        return t.getFullYear();
      case 'MM':
        return fillZero(t.getMonth() + 1);
      case 'mm':
        return fillZero(t.getMinutes());
      case 'dd':
        return fillZero(t.getDate());
      // case 'HH':
      case 'HH':
        return fillZero(t.getHours());
      case 'ss':
        return fillZero(t.getSeconds());
      default:
        return '';
    }
  });
};
const timeYearEdit = function (val, format = 'yyyy-MM-dd', len = 1) {
  let timeStr = timeFormat(val, format);
  timeStr = Number(timeStr.slice(0, 4)) - len + timeStr.slice(4);
  return timeFormat(timeStr, format);
};

//获取 一天 0点的时间 例如 2021-09-17 00:00:00
const getDateStart = function (val = '') {
  let time = timeFormat(val, 'yyyy-MM-dd');
  return `${time} 00:00:00`;
};
//获取 一天 23:59:59的时间 例如 2021-09-17 23:59:59
const getDateEnd = function (val = '') {
  let time = timeFormat(val, 'yyyy-MM-dd');
  return `${time} 23:59:59`;
};

const getDaysOfMonth = function (year, month) {
  switch (month) {
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
      return 31;
    case 4:
    case 6:
    case 9:
    case 11:
      return 30;
    case 2:
      return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28;
    default:
      return 0;
  }
};
// 将秒转换成天、小时、分钟和秒
const formatDuration = (seconds) => {
  let days = Math.floor(seconds / (3600 * 24));
  let hours = Math.floor((seconds % (3600 * 24)) / 3600);
  let minutes = Math.floor((seconds % 3600) / 60);
  let remainingSeconds = Math.floor(seconds % 60);

  let duration = '';
  if (days > 0) {
    duration += `${days}天`;
  }
  if (hours > 0) {
    duration += `${hours}小时`;
  }
  if (minutes > 0) {
    duration += `${minutes}分钟`;
  }
  if (remainingSeconds > 0 || duration === '') {
    duration += `${remainingSeconds}秒`;
  }

  return duration.trim();
};
const formatHoursDuration = (seconds) => {
  // 计算小时、分钟和剩余秒数
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  // 构造返回字符串
  let result = '';
  if (hours > 0) {
    result += `${hours}小时`;
  }
  if (minutes > 0) {
    result += `${minutes}分钟}`;
  }
  if (seconds > 0 || (hours === 0 && minutes === 0)) {
    result += `${remainingSeconds}秒`;
  }

  return result.trim(); // 去除多余空格
};
const timeFormatDate = function (val) {
  if (val === '-') return '';
  return val ? timeFormat(val) : '';
};
const timeFormatDateTime = function (val) {
  if (val === '-') return '';
  return val ? timeFormat(val, 'yyyy-MM-dd HH:mm:ss') : '';
};

// 计算两个时间间隔的天数
const getDaysBetweenDates = function (date1, date2) {
  const oneDay = 24 * 60 * 60 * 1000; // 一天的毫秒数
  const firstDate = new Date(date1);
  const secondDate = new Date(date2);
  const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
  return diffDays;

  // 用法示例
  // const today = new Date();
  // const creationDate = new Date('2022-01-01'); // 假设创建日期为 2022 年 1 月 1 日
  // const daysSinceCreation = getDaysBetweenDates(creationDate, today);
};

/**
 * 计算日期加减并格式化输出
 * @param {string} startDate - 起始日期，格式为 'YYYY-MM-DD HH:mm:ss'
 * @param {Object} offset - 偏移对象，例如 { days: 1, hours: -2 }
 * @param {string} format - 自定义格式，支持 'YYYY', 'MM', 'DD', 'HH', 'mm', 'ss'
 * @returns {string} - 格式化后的日期
 */
const calculateDate = (startDate, offset, format) => {
  const date = new Date(startDate);

  if (offset.years) {
    date.setFullYear(date.getFullYear() + offset.years);
  }
  if (offset.months) {
    date.setMonth(date.getMonth() + offset.months);
  }
  if (offset.days) {
    date.setDate(date.getDate() + offset.days);
  }
  if (offset.hours) {
    date.setHours(date.getHours() + offset.hours);
  }
  if (offset.minutes) {
    date.setMinutes(date.getMinutes() + offset.minutes);
  }
  if (offset.seconds) {
    date.setSeconds(date.getSeconds() + offset.seconds);
  }
  // .padStart(2, '0')
  const map = {
    YYYY: date.getFullYear(),
    MM: String(date.getMonth() + 1).padStart(2, '0'),
    DD: String(date.getDate()).padStart(2, '0'),
    HH: String(date.getHours()),
    mm: String(date.getMinutes()).padStart(2, '0'),
    ss: String(date.getSeconds()).padStart(2, '0'),
  };

  return format.replace(/YYYY|MM|DD|HH|mm|ss/g, (match) => map[match]);
};

export default {
  // timestamp,
  fillZero,
  timeYearEdit,
  getDateEnd,
  getDateStart,
  timeFormat,
  getDaysOfMonth,
  timeFormatDate,
  timeFormatDateTime,
  formatDuration,
  getDaysBetweenDates,
  calculateDate,
  formatHoursDuration,
};
