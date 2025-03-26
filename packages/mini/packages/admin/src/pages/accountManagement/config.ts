const searchItems = [
  {
    label: '用户名',
    prop: 'username',
    type: 'input',
    placeholder: '请输入',
  },
]

const tableColumns = [
  {
    title: 'ID',
    key: 'ID',
  },
  {
    title: '用户名',
    key: 'username',
  },
]

const detailItems = [
  {
    label: 'wxid',
    prop: 'wxid',
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
    label: '手机号',
    prop: 'phone',
  },
  {
    label: '创建时间',
    prop: 'createdAt',
  }
];

export {
  searchItems,
  tableColumns,
  detailItems
}