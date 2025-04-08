const tableColums = [
  {
    title: '产品名称',
    key: 'title',
    dataIndex: 'title',
    fixed: 'left',
  },
  {
    title: '缩略图',
    key: 'thumb',
    dataIndex: 'thumb',
    slot: 'image',
  },
  {
    title: '价格(¥)',
    dataIndex: 'price',
    key: 'price',
    width: 100,
    slot: 'price',
  },
  {
    title: '产品内容',
    dataIndex: 'content',
    key: 'content',
    width: 200,
    showTitle: true,
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    slot: 'datetime',
  },
];

const searchItems = [
  {
    label: '产品名称',
    prop: 'title',
    type: 'input',
    placeholder: '请输入服务名称',
    options: [
      {
        label: '产品名称1',
        value: '1',
      },
      {
        label: '产品内容2',
        value: '2',
      },
    ],
  },
];

const detailItems = [
  {
    label: '产品名称',
    prop: 'title',
  },
  {
    label: '缩略图',
    prop: 'thumb',
    type: 'image',
  },
  {
    label: '价格',
    prop: 'price',
    type: 'price',
  },
  {
    label: '产品内容',
    prop: 'content',
  },
  {
    label: '创建时间',
    prop: 'createdAt',
    type: 'datetime',
  },
];

const formConfig = {
  formList: [
    {
      label: '产品名称',
      prop: 'title',
      type: 'input',
      options: [],
      rules: [{ required: true, message: '请输入产品名称' }],
      span: 24,
      itemProps: {
        placeholder: '请输入服务名称',
        // disabled: true
        // readOnly: true,
      },
    },
    {
      label: '价格',
      prop: 'price',
      type: 'inputNumber',
      rules: [{ required: true, message: '请输入价格' }],
      span: 24,
      itemProps: {
        placeholder: '请输入价格',
        prefix: '￥',
        suffix: 'RMB',
        controls: false,
        precision: '2',
      },
    },
    {
      label: '缩略图',
      prop: 'thumb',
      putProp: 'thumbId',
      type: 'upload',
      span: 24,
      uploadProps: {
        listType: 'picture-card',
        accept: 'image/*',
        multiple: false,
        maxCount: 1,
      },
    },
    {
      label: '产品内容',
      prop: 'content',
      type: 'textarea',
      span: 24,
      rules: [{ required: true, message: '请输入产品内容' }],
      itemProps: {
        placeholder: '请输入服务内容',
      },
    },
  ],
  formModel: {},
  rules: [],
};

export { tableColums, searchItems, detailItems, formConfig };
