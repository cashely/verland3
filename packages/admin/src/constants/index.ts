import { IOptionItem, Option } from './types';
//预约单状态
const APPOINTMENT_STATUS = [
  {
    label: '待付款',
    value: 0,
  },
  {
    label: '已预约',
    value: 1,
  },
  {
    label: '待寄送',
    value: 2,
  },
  ,
  {
    label: '已完成',
    value: 3,
  },
  {
    label: '已取消',
    value: 4,
  },
  {
    label: '异常',
    value: 5,
  },
  {
    label: '退款中',
    value: 6,
  },
];

//发票类型
const TICKET_TYPE = [
  {
    label: '个人',
    value: 1,
  },
  {
    label: '公司',
    value: 2,
  },
];

//开票状态
const INVOICE_STATUS = [
  {
    label: '已开票',
    value: 1,
    tag: 'green',
  },
  {
    label: '未开票',
    value: 2,
    tag: 'red',
  },
];
//宠物状态
const PET_STATUS: Option = [
  {
    label: '活着',
    value: 1,
    tag: 'green',
  },
  {
    label: '死亡',
    value: 2,
    tag: 'red',
  },
];
//付款渠道
const PAY_CHANNEL = [
  {
    label: '微信',
    value: 1,
  },
  {
    label: '支付宝',
    value: 2,
  },
  {
    label: '银行卡',
    value: 3,
  },
  {
    label: '现金',
    value: 4,
  },
];
//订单渠道来源
const ORDER_CHANNEL = [
  {
    label: '平台',
    value: 1,
  },
];

//投诉建议类型
const COMPLAINT_TYPE = [
  {
    label: '建议',
    value: 1,
  },
  {
    label: '投诉',
    value: 2,
  },
];

const HANDLE_WAYS = [
  {
    label: '无需处理',
    value: 1,
  },
  {
    label: '自行提取',
    value: 2,
  },
  {
    label: '放弃处理',
    value: 3,
  },
];

const SERVICE_TYPE = [
  {
    label: '上门服务',
    value: 1,
  },
  {
    label: '预约服务',
    value: 2,
  },
];

//是否需要仪式
const RITE_TYPE = [
  {
    label: '是',
    value: 1,
  },
  {
    label: '否',
    value: 2,
  },
];

//是否寄送
const DELIVERY_TYPE = [
  {
    label: '是',
    value: 1,
  },
  {
    label: '否',
    value: 2,
  },
];

//性别
const GENDER_TYPE = [
  {
    label: '男',
    value: 0,
  },
  {
    label: '女',
    value: 1,
  },
];

const tagColorMap = (arr: IOptionItem[]) => {
  const obj = {} as Record<number, string>;
  return arr.reduce((acc: Record<number, string>, cur: IOptionItem) => {
    acc[cur.value] = cur.tag;
    return acc;
  }, obj);
};

function getLabelByValue(arr: any[], value: any) {
  let label = '';
  arr.forEach((item) => {
    if (item.value === value) {
      label = item.label;
    }
  });
  return label || '-';
}
export {
  TICKET_TYPE,
  PET_STATUS,
  PAY_CHANNEL,
  ORDER_CHANNEL,
  INVOICE_STATUS,
  COMPLAINT_TYPE,
  HANDLE_WAYS,
  SERVICE_TYPE,
  RITE_TYPE,
  APPOINTMENT_STATUS,
  GENDER_TYPE,
  DELIVERY_TYPE,
  getLabelByValue,
  tagColorMap,
};
