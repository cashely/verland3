import { TICKET_TYPE } from '@/constants';

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
    fixed: 'left',
  },
  {
    title: '宠物名称',
    key: 'petname',
    dataIndex: 'petname',
  },
  {
    title: '缩略图',
    key: 'image',
    dataIndex: 'image',
  },
  {
    title: '宠物子类',
    key: 'subType',
    dataIndex: 'subType',
  },
  {
    title: '年龄',
    key: 'age',
    dataIndex: 'age',
  },
  {
    title: '体重(kg)',
    key: 'weight',
    dataIndex: 'weight',
  },
  {
    title: '宠物状态',
    key: 'statu',
    dataIndex: 'statu',
    render(_) {
      if (!_) return '-';
      return _ === 1 ? '活着' : '死亡';
    },
  },
  {
    title: '创建时间',
    key: 'createdAt',
    dataIndex: 'createdAt',
    type: 'datetime',
  },
];

const detailItems = [
  {
    label: '产品名称',
    prop: 'title',
  },
  {
    label: '缩略图',
    prop: 'thumnb',
  },
  {
    label: '价格',
    prop: 'price',
  },
  {
    label: '产品内容',
    prop: 'content',
  },
  {
    label: '创建时间',
    prop: 'createdAt',
  },
];

export { searchItems, tableColumns, detailItems };
