import { COMPLAINT_TYPE, getLabelByValue } from '@/constants';
const searchItems = [
  {
    label: '投诉建议类型',
    prop: 'type',
    type: 'select',
    placeholder: '请选择服务类型',
    options: COMPLAINT_TYPE,
  },
];

const tableColums = [
  {
    title: '投诉用户',
    dataIndex: 'user',
    key: 'user',
    width: 140,
    render: (_: any) => _?.username || '-',
  },
  {
    title: '投诉类型',
    key: 'type',
    dataIndex: 'type',
    width: 100,
    render: (_: number) => getLabelByValue(COMPLAINT_TYPE, _),
  },
  {
    title: '投诉内容',
    dataIndex: 'content',
    key: 'content',
    showTitle: true,
  },
  {
    title: '答复内容',
    dataIndex: 'replayContent',
    key: 'replayContent',
    showTitle: true,
  },
  {
    title: '答复时间',
    dataIndex: 'replayAt',
    key: 'replayAt',
    slot: 'datetime',
  },

  {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    slot: 'datetime',
  },
];

const formConfig = {
  formList: [
    {
      label: '回复内容',
      prop: 'replayContent',
      type: 'textarea',
      rules: [{ required: true, message: '请输入内容' }],
      span: 24,
      itemProps: {
        placeholder: '请输入内容',
      },
    },
  ],
  formModel: {
    replayContent: '',
  },
};

const detailItems = [
  {
    label: '投诉用户',
    prop: 'user',
    render: (_: any) => _?.username || '-',
  },
  {
    label: '投诉类型',
    prop: 'type',
    render: (_: number) => getLabelByValue(COMPLAINT_TYPE, _),
  },
  {
    label: '投诉内容',
    prop: 'content',
  },
  {
    label: '反馈内容',
    prop: 'replayContent',
  },
  {
    label: '反馈时间',
    prop: 'replayAt',
    type: 'datetime',
  },
  {
    label: '创建时间',
    prop: 'createdAt',
    type: 'datetime',
  },
];

export { searchItems, tableColums, formConfig, detailItems };
