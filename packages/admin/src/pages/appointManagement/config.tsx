import { Button, Tag } from 'antd';
import { PhoneFilled, UserOutlined } from '@ant-design/icons';
import {
  HANDLE_WAYS,
  getLabelByValue,
  ORDER_CHANNEL,
  PAY_CHANNEL,
  RITE_TYPE,
  APPOINTMENT_STATUS,
} from '@/constants';
import { refundDetail } from '@/apis/modules/book';
import { message } from 'antd';
const searchItems = [
  {
    label: '状态',
    prop: 'statu',
    type: 'select',
    clearable: true,
    placeholder: '请选择状态',
    options: APPOINTMENT_STATUS,
    initValue: '',
  },
];

const tableColumns = [
  {
    title: '套餐类型',
    key: 'menu',
    dataIndex: 'menu',
    fixed: 'left',
    render(_: any) {
      if (!_) return;
      return _?.name || '-';
    },
  },
  {
    title: '预约上门时间',
    dataIndex: 'bookDateTime',
    slot: 'datetime',
  },
  {
    title: '用户信息',
    dataIndex: 'user',
    width: 256,
    render: (_: any) => {
      return (
        <>
          <Tag icon={<UserOutlined />} color="processing">
            {_?.nickname || '-'}
          </Tag>
          <Tag icon={<PhoneFilled />} color="processing">
            {_?.phone || ''}
          </Tag>
        </>
      );
    },
  },
  {
    title: '宠物信息',
    dataIndex: 'pet',
    render: (_: any) => _?.type + '/' + _?.subType,
  },
  {
    title: '遗物处理方式',
    dataIndex: 'handleWay',
    render(_: number) {
      if (!_) return;
      return (
        <Tag color="geekblue">
          {HANDLE_WAYS.find((item) => item.value === _)?.label || '-'}
        </Tag>
      );
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
    width: 220,
    showTitle: true,
    render(_: any) {
      return `${_.province || ''}${_.city || ''}${_.area || ''}${
        _.detail || ''
      }`;
    },
  },
  {
    title: '是否需要仪式',
    dataIndex: 'isRite',
    render: (_: number) => getLabelByValue(RITE_TYPE, _),
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
    slot: 'price',
  },
  {
    title: '付款金额（元）',
    dataIndex: 'payAmount',
    key: 'payAmount',
    slot: 'price',
  },
  {
    title: '付款渠道',
    key: 'payChannel',
    dataIndex: 'payChannel',
    render: (_: number) => getLabelByValue(PAY_CHANNEL, _),
  },
  {
    title: '付款信息',
    key: 'payInfo',
    dataIndex: 'payInfo',
    width: 300,
    render: (_: number, record: any) => {
      return (
        <>
          <p>订单编号：{record.outTradeNo || '-'}</p>
          <p>交易流水号：{record.transactionId || '-'}</p>
          <p>退款订单编号：{record.outRefundNo || '-'}</p>
        </>
      );
    },
  },
  {
    title: '订单来源渠道',
    key: 'channel',
    dataIndex: 'channel',
    render: (_: number) => getLabelByValue(ORDER_CHANNEL, _),
  },
  {
    title: '付款状态',
    key: 'statu',
    dataIndex: 'statu',
    render(_: number, record: any) {
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
        case 5:
          return '异常';
        case 6:
          return (
            <div>
              <Button
                type="primary"
                onClick={() => {
                  refundDetail(record.outRefundNo).then(() => {
                    message.success('退款成功');
                  });
                }}
              >
                退款中
              </Button>
            </div>
          );
      }
    },
  },
  {
    title: '创建时间',
    prop: 'createdAt',
    dataIndex: 'createdAt',
    slot: 'datetime',
  },
];

const detailItems = [
  {
    label: '预约用户',
    prop: 'user',
    render: (_: any) => _?.username || '-',
  },
  {
    label: '套餐类型',
    prop: 'menu',
    render: (_: any) => _.name,
  },
  {
    label: '附加服务',
    prop: 'bookGoods',
    render: (_: any) => _?.map((n: any) => n.bookGood?.title).join() || '-',
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
    render: (_: number) => getLabelByValue(ORDER_CHANNEL, _),
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
        case 5:
          return '异常';
        case 6:
          return '退款中';
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

const formConfig = {
  formList: [
    {
      label: '寄送的快递单号',
      prop: 'expressNo',
      type: 'input',
      rules: [{ required: true, message: '请输入' }],
      span: 24,
      itemProps: {
        placeholder: '请输入',
      },
    },
    {
      label: '寄送的快递名称',
      prop: 'expressName',
      type: 'input',
      span: 24,
      rules: [{ type: 'array', required: true, message: '请输入' }],
      itemProps: {
        placeholder: '请输入',
      },
    },
  ],
  formModel: {},
};

export { searchItems, tableColumns, detailItems, formConfig };
