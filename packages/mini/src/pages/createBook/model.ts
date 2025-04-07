import {
  RITE_SERVICE_TIME_RANGES,
  SERVICE_TIME_RANGES,
  WEIGHT_OPTIONS,
} from '@/constants';
const baseInfoFormList = [
  // {
  //   label: '联系人',
  //   prop: 'username',
  //   type: 'input',
  //   itemProps: {
  //     placeholder: '请填写联系人的名字',
  //     // required: true,
  //   },
  //   rules: [],
  // },
  // {
  //   label: '联系电话',
  //   prop: 'phone',
  //   type: 'phone',
  //   itemProps: {
  //     placeholder: '请填写联系人的电话',
  //   },
  //   rules: [],
  // },
  {
    label: '爱宠名字',
    prop: 'petname',
    type: 'input',
    itemProps: {
      placeholder: '请填写爱宠名字',
    },
    rules: [],
  },
  {
    label: '爱宠类型',
    prop: 'type',
    type: 'multiSelector',
    itemProps: {
      placeholder: '请选择',
      // required: true,
    },
    options: [
      ['猫', '脊柱动物'],
      ['英短', '金渐层', '田园猫', '银渐层', '比鲁斯'],
    ],
    rules: [],
  },
  {
    label: '爱宠体重',
    prop: 'weight',
    type: 'selector',
    itemProps: {
      placeholder: '请选择',
    },
    options: WEIGHT_OPTIONS,
  },
];

const otherFormList = [
  {
    label: '基础服务',
    prop: 'menuId',
    type: 'tabs',
    itemProps: {
      placeholder: '请输入用户名',
    },
    tabsTitle: [],
    tabsOptions: [],
    rules: [],
  },
  {
    label: '上门服务时间', //"上门服务日期",
    prop: 'bookDateTime',
    type: 'picker-date',
    itemProps: {
      placeholder: '请选择',
    },
    rules: [],
    timeRange: SERVICE_TIME_RANGES,
  },
  // {
  //   label: "收取地址",
  //   prop: "getAddress",
  //   type: "location",
  //   itemProps: {
  //     placeholder: "点击获取地址",
  //   },
  //   rules: [],
  // },
  // {
  //   label: "详细地址",
  //   prop: "address",
  //   type: "textarea",
  //   itemProps: {
  //     placeholder: "请输入用户名",
  //   },
  //   rules: [],
  // },
  {
    label: '是否需要仪式',
    prop: 'isRite',
    type: 'radio',
    options: [
      {
        label: '是',
        value: '1',
        checked: true,
      },
      {
        label: '否',
        value: '2',
      },
    ],
    rules: [],
  },
  {
    label: '预约仪式日期',
    prop: 'riteDateTime',
    type: 'picker-date',
    itemProps: {
      placeholder: '请选择预约仪式日期',
    },
    rules: [],
    timeRange: RITE_SERVICE_TIME_RANGES,
    supportAll: true,
    hidden: false,
  },
  {
    label: '纪念物获取方式',
    prop: 'handleWay',
    type: 'radio',
    options: [
      {
        label: '自行提取',
        value: '2',
        checked: true,
      },
      {
        label: '邮寄寄送',
        value: '1',
      },
      {
        label: '放弃处置',
        value: '3',
      },
    ],
    rules: [],
  },
  {
    label: '',
    prop: 'handleWayCheck',
    type: 'checkbox',
    options: [
      {
        label: '放弃处置无害化处理后遗留申明',
        value: '1',
      },
    ],
    hidden: true,
  },
  {
    label: '纪念物获取时间',
    prop: 'handleDateTime',
    type: 'picker-date',
    itemProps: {
      placeholder: '请选择遗物处理时间',
    },
    rules: [],
    hidden: false,
    timeRange: SERVICE_TIME_RANGES,
    supportAll: true,
  },
  {
    label: '接收地址',
    prop: 'postAddress',
    // type: "textarea",
    type: 'location',
    itemProps: {
      placeholder: '点击选择位置',
    },
    rules: [],
  },
  {
    label: '门牌号',
    prop: 'detail',
    type: 'input',
    itemProps: {
      placeholder: '详细地址，例1层101室',
    },
    rules: [],
  },
  {
    label: '备注',
    prop: 'mark',
    type: 'textarea',
    itemProps: {
      placeholder: '请输入',
    },
    rules: [],
  },
];

export { otherFormList, baseInfoFormList };
