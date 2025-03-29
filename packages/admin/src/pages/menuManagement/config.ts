import { formatPrice } from '@/utils';
const searchItems = [
  {
    label: '套餐名称',
    prop: 'type',
    type: 'input',
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
    title: '套餐名称',
    key: 'name',
    dataIndex: 'name',
  },
  {
    title: '套餐内容',
    key: 'description',
    dataIndex: 'description',
  },
  {
    title: '套餐价格(¥)',
    key: 'price',
    dataIndex: 'price',
    render: (_) => formatPrice(_),
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
    label: '套餐名称',
    prop: 'name',
  },
  {
    label: '套餐内容',
    prop: 'description',
  },
  {
    label: '套餐价格(¥)',
    prop: 'price',
    render(_) {
      if (!_) return '-';
      return formatPrice(_);
    },
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
      label: '套餐名称',
      prop: 'name',
      type: 'input',

      rules: [{ required: true, message: '请输入产品名称' }],
      span: 24,
      itemProps: {
        placeholder: '请输入套餐名称',
        // disabled: true
        // readOnly: true,
      },
    },
    {
      label: '价格(¥)',
      prop: 'price',
      type: 'inputNumber',
      rules: [{ required: true, message: '请输入价格' }],
      span: 24,
      itemProps: {
        placeholder: '请输入套餐价格',
        prefix: '￥',
        suffix: 'RMB',
        controls: false,
        precision: '2',
      },
    },

    {
      label: '产品内容',
      prop: 'description',
      type: 'textarea',
      span: 24,
      rules: [{ required: true, message: '请输入套餐内容' }],
      itemProps: {
        placeholder: '请输入套餐内容',
        // readonly: true,
        // required: true,
      },
    },
  ],
  formModel: {},
  rules: [],
};

export { searchItems, tableColumns, detailItems, formConfig };
