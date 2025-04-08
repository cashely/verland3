//预约单状态
const ORDER_STATUS = {
  1: '已预约',
  2: '待处理',
  3: '已完成',
  4: '已取消',
};

const PET_TYPES = ['猫', '狗', '异宠'];

const PET_SUBTYPES = [
  [
    '英国短毛猫',
    '美国短毛猫',
    '中华田园猫',
    '布偶猫',
    '暹罗猫',
    '波斯猫',
    '缅因猫',
    '德文卷毛猫',
    '斯芬克斯猫（无毛猫）',
    '阿比西尼亚猫',
    '金吉拉',
    '卷耳猫',
  ],
  [
    '贵宾犬（泰迪）',
    '博美犬',
    '吉娃娃',
    '比熊犬',
    '柯基犬',
    '雪纳瑞',
    '腊肠犬',
    '边境牧羊犬',
    '金毛寻回犬',
    '拉布拉多犬',
    '哈士奇',
    '阿拉斯加犬',
    '德国牧羊犬',
    '柴犬',
    '英国可卡犬',
    '约克夏梗',
  ],
  [
    '龙猫',
    '蜜袋鼯',
    '刺猬',
    '蛇',
    '蜥蜴',
    '龟',
    '蜘蛛',
    '蝎',
    '蜈蚣',
    '兔',
    '鸟',
    '水母',
    '蛙',
    '猪',
    '貂',
    '松鼠',
    '寄居蟹',
    '鱼',
  ],
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
    label: '待处理',
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

const WEIGHT_OPTIONS = [
  {
    label: '0-5斤',
    value: 1,
  },
  { label: '5-10斤', value: 2 },
  { label: '10-20斤', value: 3 },
  { label: '20斤以上', value: 4 },
];

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
  // '22:00',
];

//仪式服务时间段
const RITE_SERVICE_TIME_RANGES = ['10:00', '12:00', '14:00', '16:00'];
//  '24:00'
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
  PET_SUBTYPES,
};
