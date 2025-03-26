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

export { ORDER_STATUS, PET_TYPES, GENDER, BASE_SERVICES, TICKET_TYPE };
