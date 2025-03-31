import { GENDER_TYPE, getLabelByValue } from '@/constants';
const searchItems = [
  {
    label: '用户名',
    prop: 'username',
    type: 'input',
    placeholder: '请输入',
  },
];

const tableColumns = [
  {
    title: '用户名',
    key: 'username',
    dataIndex: 'username',
  },
  {
    title: '昵称',
    key: 'nickname',
    dataIndex: 'nickname',
  },
  {
    title: 'OpenId',
    key: 'wxid',
    dataIndex: 'wxid',
    width: 240,
  },
  {
    title: '性别',
    key: 'gender',
    dataIndex: 'gender',
    render: (_: number) => getLabelByValue(GENDER_TYPE, _),
  },
  {
    title: '手机号',
    key: 'phone',
    dataIndex: 'phone',
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
    label: 'wxid',
    prop: 'wxid',
  },
  {
    label: '昵称',
    prop: 'nickname',
  },
  {
    label: '用户名',
    prop: 'username',
  },
  {
    label: '头像',
    prop: 'thumb',
  },
  {
    label: '性别',
    prop: 'gender',
    render: (_: number) => getLabelByValue(GENDER_TYPE, _),
  },
  {
    label: '手机号',
    prop: 'phone',
  },
  {
    label: '创建时间',
    prop: 'createdAt',
    type: 'datetime',
  },
];

export { searchItems, tableColumns, detailItems };
