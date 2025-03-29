import dayjs from 'dayjs';

const formatDateTime = (date: string | Date) => {
  if (!date) return '-';
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
};

//格式化金额 分为单位
const formatPrice = (price: number) => {
  return (price / 100).toLocaleString() || 0;
};

export { formatDateTime, formatPrice };
