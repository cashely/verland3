import {
  HANDLE_WAYS,
  getLabelByValue,
  ORDER_CHANNEL,
  PAY_CHANNEL,
  RITE_TYPE,
  APPOINTMENT_STATUS,
} from '@/constants';
const searchItems = [
  {
    label: '状态',
    prop: 'statu',
    type: 'select',
    placeholder: '请选择状态',
    options: APPOINTMENT_STATUS,
  },
];

const tableColumns = [
  {
    title: '套餐类型',
    key: 'menu',
    dataIndex: 'menu',
    fixed: 'left',
    render(_: number) {
      if (!_) return;
      console.log('>>>', _);
      return _?.name || '-';
    },
  },
  {
    title: '预约上门时间',
    dataIndex: 'bookDateTime',
    slot: 'datetime',
  },
  {
    title: '遗物处理方式',
    dataIndex: 'handleWay',
    render(_: number) {
      if (!_) return;
      return HANDLE_WAYS.find((item) => item.value === _)?.label || '-';
    },
  },
  {
    title: '遗物处理时间',
    dataIndex: 'handleDateTime',
    key: 'handleDateTime',
    slot: 'datetime',
  },
  {
    title: '快递地址',
    key: 'address',
    dataIndex: 'address',
    render(_) {
      return `${_.province || ''}${_.city || ''}${_.area || ''}${
        _.detail || ''
      }`;
    },
  },
  {
    title: '是否需要仪式',
    dataIndex: 'isRite',
    render(_) {
      if (!_) return '-';
      return RITE_TYPE.find((item) => item.value === _)?.label || '-';
    },
  },
  {
    title: '仪式时间',
    dataIndex: 'riteDateTime',
    key: 'riteDateTime',
    slot: 'datetime',
  },
  {
    title: '总金额（元）',
    key: 'totalAmount',
    dataIndex: 'totalAmount',
    render(_) {
      if (!Number.isInteger(_)) return '-';
      return (_ / 100).toLocaleString();
    },
  },
  {
    title: '付款金额（元）',
    dataIndex: 'payAmount',
    key: 'payAmount',
    render(_) {
      if (!Number.isInteger(_)) return '-';
      return (_ / 100).toLocaleString();
    },
  },
  {
    title: '付款渠道',
    key: 'payChannel',
    dataIndex: 'payChannel',
    render(_: number) {
      return _ === 1 ? '微信' : '支付宝';
    },
  },
  {
    title: '订单来源渠道',
    key: 'channel',
    dataIndex: 'channel',
    render(_: number) {
      return _ === 1 ? '平台' : '小程序';
    },
  },
  {
    title: '付款状态',
    key: 'statu',
    dataIndex: 'statu',
    render(_: number) {
      // 待付款  已预约  待寄送  已完成  已取消
      switch (_) {
        case 0:
          return '待付款';
        case 1:
          return '已预约';
        case 2:
          return '待寄送';
        case 3:
          return '已完成';
        case 4:
          return '已取消';
      }
    },
  },
];

const detailItems = [
  {
    label: '预约用户',
    prop: 'user',
    render(_) {
      if (!_) return;
      return _?.username || '-';
    },
  },
  {
    label: '套餐类型',
    prop: 'menu',
    render(_: any) {
      if (!_) return;
      return _.name;
    },
  },
  {
    label: '预约上门时间',
    prop: 'bookDateTime',
    type: 'datetime',
  },
  {
    label: '遗物处理方式',
    prop: 'handleWay',
    render(_: number) {
      if (!_) return '-';
      return getLabelByValue(HANDLE_WAYS, _);
    },
  },
  {
    label: '快递时间',
    prop: 'handleDateTime',
    type: 'datetime',
  },
  {
    label: '快递地址',
    prop: 'address',
    render(_) {
      if (!_) return;
      return `${_.province || ''}${_.city || ''}${_.area || ''}${
        _.detail || ''
      }`;
    },
  },
  {
    label: '是否需要仪式',
    prop: 'isRite',
    render: (_) => getLabelByValue(RITE_TYPE, _),
  },
  {
    label: '仪式时间',
    prop: 'riteDateTime',
    type: 'datetime',
  },
  {
    label: '总金额（元）',
    prop: 'totalAmount',
    type: 'price',
  },
  {
    label: '付款金额（元）',
    prop: 'payAmount',
    type: 'price',
  },
  {
    label: '订单渠道来源',
    prop: 'channel',
    render: (_: number) => getLabelByValue(ORDER_CHANNEL, _),
  },
  {
    label: '付款渠道',
    prop: 'payChannel',
    render: (_: number) => getLabelByValue(PAY_CHANNEL, _),
  },
  {
    label: '订单来源渠道',
    prop: 'channel',
    render(_: number) {
      return _ === 1 ? '平台' : '小程序';
    },
  },
  {
    label: '付款状态',
    prop: 'statu',
    render(_: number) {
      // 待付款  已预约  待寄送  已完成  已取消
      switch (_) {
        case 0:
          return '待付款';
        case 1:
          return '已预约';
        case 2:
          return '待寄送';
        case 3:
          return '已完成';
        case 4:
          return '已取消';
      }
    },
  },
  {
    label: '支付订单号',
    prop: 'outTradeNo',
  },
  {
    label: '退款订单号',
    prop: 'outRefundNo',
  },
  {
    label: '支付结果订单号',
    prop: 'transactionId',
  },
  {
    label: '寄送的快递名称',
    prop: 'expressName',
  },
  {
    label: '寄送的快递单号',
    prop: 'expressNo',
  },
];

export { searchItems, tableColumns, detailItems };
