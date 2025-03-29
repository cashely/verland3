//预约单状态
const ORDER_STATUS = {
  1: '已预约',
  2: '待寄送',
  3: '已完成',
  4: '已取消',
};

const PET_TYPES = [
  ['猫', '脊柱动物'],
  ['英短', '金渐层', '田园猫', '银渐层', '比鲁斯'],
];

const GENDER = ['男', '女'];

const TICKET_TYPE = [
  {
    label: '个人',
    value: '1',
  },
  {
    label: '企业',
    value: '2',
  },
];

const BASE_SERVICES = [
  {
    label: '上门服务',
    value: 1,
    price: '100',
  },
  {
    label: '预约服务',
    value: 2,
    price: '200',
  },
];

const APPOINTMENT_TYPES = {
  0: {
    label: '待付款',
    bgClass: 'js',
  },
  1: {
    label: '已预约',
    bgClass: 'yy',
  },
  2: {
    label: '待寄送',
    bgClass: 'js',
  },
  3: {
    label: '已完成',
    bgClass: 'wc',
  },
  4: {
    label: '已取消',
    bgClass: 'qx',
  },
  5: {
    label: '异常',
    bgClass: 'yc',
  },
  6: {
    label: '退款中',
    bgClass: 'js',
  },
};

const TICKET_STATUS_TYPE = {
  1: '已开票',
  2: '未开票',
  3: '用户催票',
};

const DEFAULT_IMAGE =
  'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0';

export {
  APPOINTMENT_TYPES,
  ORDER_STATUS,
  PET_TYPES,
  GENDER,
  BASE_SERVICES,
  TICKET_TYPE,
  DEFAULT_IMAGE,
  TICKET_STATUS_TYPE,
};
