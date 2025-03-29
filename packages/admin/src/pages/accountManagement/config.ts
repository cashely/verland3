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
    title: 'ID',
    key: 'id',
    dataIndex: 'id',
  },
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
    title: 'openid',
    key: 'wxid',
    dataIndex: 'wxid',
  },
  {
    title: '性别',
    key: 'gender',
    dataIndex: 'gender',
    render(d: number) {
      return d === 0 ? '男' : '女';
    },
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
    render(d: number) {
      console.log(d, '++++');
      return d === 0 ? '男' : '女';
    },
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
