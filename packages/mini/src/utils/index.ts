import dayjs from 'dayjs';

const formatDateTime = (date: string | Date) => {
  if (!date) return '-';
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
};

//格式化金额 分为单位
const formatPrice = (price: number) => {
  if (isNaN(price)) return 0;
  return (price / 100).toLocaleString() || 0;
};
//给出完整地址，返回省市区
const formatAddress = (address: string) => {
  // 正则表达式匹配中国地址格式：省+市+区+详细地址
  const regex = /^(.+省)(.+市)(.+区)(.+)$/;
  const match = address.match(regex);
  let result = {};
  if (match) {
    result = {
      province: match[1] || '', // 省
      city: match[2] || '', // 市
      district: match[3] || '', // 区
      detail: match[4] || '', // 详细地址
    };
  }
  return result;
};
export { formatDateTime, formatPrice, formatAddress };
