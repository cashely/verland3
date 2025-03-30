import {
  TICKET_TYPE,
  PET_STATUS,
  getLabelByValue,
  tagColorMap,
} from '@/constants';

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
    title: '宠物名称',
    key: 'petname',
    dataIndex: 'petname',
  },
  {
    title: '缩略图',
    key: 'petImage',
    dataIndex: 'petImage',
    slot: 'image',
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
    slot: 'tag',
    tagObj: tagColorMap(PET_STATUS),
    options: PET_STATUS,
  },
  {
    title: '创建时间',
    key: 'createdAt',
    dataIndex: 'createdAt',
    slot: 'datetime',
  },
];

const detailItems = [
  {
    label: '宠物名称',
    prop: 'petname',
  },
  {
    label: '缩略图',
    prop: 'petImage',
    type: 'image',
  },
  {
    label: '宠物类别',
    prop: 'type',
  },
  {
    label: '宠物子类',
    prop: 'subType',
  },
  {
    label: '年龄(月)',
    prop: 'age',
  },
  {
    label: '体重(kg)',
    prop: 'weight',
  },
  {
    label: '宠物状态',
    prop: 'statu',
    render: (_: number) => getLabelByValue(PET_STATUS, _),
  },
  {
    label: '创建时间',
    prop: 'createdAt',
    type: 'datetime',
  },
];

export { searchItems, tableColumns, detailItems };
