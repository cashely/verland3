import { formatPrice } from '@/utils';
const searchItems = [
  {
    label: '门店名称',
    prop: 'name',
    type: 'input',
    placeholder: '请输入',
  },
];

const tableColumns = [
  {
    title: '门店名称',
    key: 'name',
    dataIndex: 'name',
  },
  {
    title: '门店地址',
    key: 'address',
    dataIndex: 'address',
    width: 200,
    showTitle: true,
  },
  {
    title: '门店价格(¥)',
    key: 'price',
    dataIndex: 'price',
    slot: 'price',
  },
  {
    title: '门店电话',
    key: 'tel',
    dataIndex: 'tel',
  },
  {
    title: '门店联系人',
    key: 'contact',
    dataIndex: 'contact',
  },
  {
    title: '创建时间',
    key: 'createdAt',
    dataIndex: 'createdAt',
    slot: 'datetime',
  },
  {
    title: '更新时间',
    key: 'updatedAt',
    dataIndex: 'updatedAt',
    slot: 'datetime',
  },
];

const detailItems = [
  {
    label: '门店名称',
    prop: 'name',
  },
  {
    label: '门店地址',
    prop: 'address',
  },
  {
    label: '门店价格(¥)',
    prop: 'price',
    render: (_: number) => formatPrice(_),
  },
  {
    label: '门店电话',
    prop: 'tel',
  },
  {
    label: '门店联系人',
    prop: 'contact',
  },
  {
    label: '创建时间',
    prop: 'createdAt',
    type: 'datetime',
  },
  {
    label: '更新时间',
    prop: 'updatedAt',
    type: 'datetime',
  },
];

const formConfig = {
  formList: [
    {
      label: '门店名称',
      prop: 'name',
      type: 'input',

      rules: [{ required: true, message: '请输入产品名称' }],
      span: 24,
      itemProps: {
        placeholder: '请输入套餐名称',
      },
    },
    {
      label: '门店地址',
      prop: 'address',
      type: 'input',

      rules: [{ required: true, message: '请输入' }],
      span: 24,
      itemProps: {
        placeholder: '请输入',
      },
    },
    {
      label: '门店电话',
      prop: 'tel',
      type: 'input',

      rules: [{ required: true, message: '请输入' }],
      span: 24,
      itemProps: {
        placeholder: '请输入',
      },
    },
    {
      label: '门店联系人',
      prop: 'contact',
      type: 'input',
      rules: [{ required: true, message: '请输入' }],
      span: 24,
      itemProps: {
        placeholder: '请输入',
      },
    },
    {
      label: '门店价格(¥)',
      prop: 'price',
      type: 'inputNumber',
      rules: [{ required: true, message: '请输入' }],
      span: 24,
      itemProps: {
        placeholder: '请输入',
        prefix: '￥',
        suffix: 'RMB',
        controls: false,
        precision: '2',
      },
    },
  ],
  formModel: {
    isRite: 1,
    isHandleWay: 1
  },
  rules: [],
};

export { searchItems, tableColumns, detailItems, formConfig };
