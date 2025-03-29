import {
  getLabelByValue,
  TICKET_TYPE,
  INVOICE_STATUS,
  tagColorMap,
} from '@/constants';
import { formatPrice } from '@/utils';
const searchItems = [
  {
    label: '发票类型',
    prop: 'type',
    type: 'select',
    placeholder: '请选择发票类型',
    options: TICKET_TYPE,
  },
];

const tableColumns = [
  {
    title: 'ID',
    key: 'id',
    dataIndex: 'id',
  },
  {
    title: '发票抬头',
    key: 'header',
    dataIndex: 'header',
  },
  {
    title: '发票类型',
    key: 'type',
    dataIndex: 'type',
    render: (_) => getLabelByValue(TICKET_TYPE, _),
  },
  {
    title: '附加服务',
    key: 'book',
    dataIndex: 'book',
    render: (_) => {
      if (!_) return;
      return _.bookGoods?.map((item) => item.name).join('，') || '无';
    },
  },
  {
    title: '税号',
    key: 'number',
    dataIndex: 'number',
  },
  {
    title: '发票金额(¥)',
    key: 'book',
    dataIndex: 'book',
    render: (_: any) => formatPrice(_.totalAmount),
  },
  {
    title: '开票状态',
    key: 'statu',
    dataIndex: 'statu',
    slot: 'tag',
    tagObj: tagColorMap(INVOICE_STATUS),
    options: INVOICE_STATUS,
  },
  {
    title: '邮箱',
    key: 'email',
    dataIndex: 'email',
  },
  {
    title: '开票时间',
    key: 'createdAt',
    dataIndex: 'createdAt',
    slot: 'datetime',
  },
];

const detailItems = [
  {
    label: '发票抬头',
    prop: 'header',
  },
  {
    label: '发票类型',
    prop: 'type',
    render: (_) => getLabelByValue(TICKET_TYPE, _),
  },
  {
    label: '附加服务',
    prop: 'book',

    render: (_) => {
      if (!_) return;
      return _.bookGoods?.map((item: any) => item.name).join('，') || '无';
    },
  },
  {
    label: '税号',
    prop: 'number',
  },
  {
    label: '发票金额(¥)',
    prop: 'book',
    render: (_: any) => formatPrice(_?.totalAmount),
  },
  {
    label: '开票状态',
    prop: 'statu',
    render: (_: number) => getLabelByValue(INVOICE_STATUS, _),
  },
  {
    label: '邮箱',
    prop: 'email',
    dataIndex: 'email',
  },
  {
    label: '开票时间',
    prop: 'createdAt',
    type: 'datetime',
  },
];

export { searchItems, tableColumns, detailItems };
