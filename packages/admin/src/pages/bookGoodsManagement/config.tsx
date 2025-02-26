

const tableColums = [
  {
    title: '产品名称',
    key: 'title',
    fixed: 'left',
  },
  {
    title: '缩略图',
    key: 'thumb',
    slot: "image"
  },
  {
    title: '价格',
    key: 'price',
  },
  {
    title: '产品内容',
    key: 'content',
  },
  {
    title: '创建时间',
    key: 'createdAt',
    slot: 'datetime'
  },
]

const searchItems = [
  {
    label: '产品名称',
    prop: 'title',
    type: 'input',
    placeholder: '请输入服务名称',
    options: [{
      label: '产品名称1',
      value: '1'
    },
    {
      label: '产品内容2',
      value: '2'
    },
    ]
  },
]

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
  }
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
      }
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
        suffix: "RMB",
        controls: false,
        precision: "2",
      }
    },
    {
      label: "缩略图",
      prop: 'thumb',
      type: 'upload',
      span: 24,
    },
    {
      label: '产品内容',
      prop: 'content',
      type: 'textarea',
      span: 24,
      itemProps: {
        placeholder: '请输入服务内容',
        // readonly: true,
        // required: true,
      }
    }
  ],
  formModel: {},
  rules: []
}



export {
  tableColums,
  searchItems,
  detailItems,
  formConfig
}