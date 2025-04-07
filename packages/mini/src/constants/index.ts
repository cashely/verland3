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

const GENDER = ['', '男', '女'];

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

const WEIGHT_OPTIONS = ['0-5斤', '5-10斤', '10-20斤', '20斤以上'];

//上门服务时间段
const SERVICE_TIME_RANGES = [
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
];

//仪式服务时间段
const RITE_SERVICE_TIME_RANGES = ['10:00', '12:00', '14:00', '16:00', '24:00'];

//退款通知
const REFUND_TMP = 'XKQpCEj93wAHPxWaQoET5UwYHkHHnCDP_K4YtOeRpkY';
//付款通知
const PAY_TMP = 'fIijh96IYidJFYVTWwW2FsvEu2b7yKaQ7MO9FDv8M7U';

export {
  APPOINTMENT_TYPES,
  ORDER_STATUS,
  PET_TYPES,
  GENDER,
  BASE_SERVICES,
  TICKET_TYPE,
  DEFAULT_IMAGE,
  TICKET_STATUS_TYPE,
  REFUND_TMP,
  PAY_TMP,
  WEIGHT_OPTIONS,
  SERVICE_TIME_RANGES,
  RITE_SERVICE_TIME_RANGES,
};
