import { COMPLAINT_TYPE } from '@/constants';
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
    title: '投诉类型',
    key: 'type',
    dataIndex: 'type',
    width: 100,
    render(_: number) {
      return COMPLAINT_TYPE.find((item) => item.value === _)?.label;
    },
  },
  {
    title: '投诉内容',
    dataIndex: 'content',
    key: 'content',
  },
  {
    title: '答复内容',
    dataIndex: 'replayContent',
    key: 'replayContent',
  },
  {
    title: '答复时间',
    dataIndex: 'replayAt',
    key: 'replayAt',
    slot: 'datetime',
  },
  {
    title: '投诉用户',
    dataIndex: 'user',
    key: 'user',
    render(_: any) {
      return _?.username || '-';
    },
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

export { searchItems, tableColums, formConfig };
