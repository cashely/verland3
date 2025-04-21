import {
  RITE_SERVICE_TIME_RANGES,
  SERVICE_TIME_RANGES,
  PET_TYPES,
} from '@/constants';

const baseInfoFormList = [
  {
    label: '联系人',
    prop: 'username',
    type: 'input',
    itemProps: {
      placeholder: '请填写联系人的名字',
      // required: true,
    },
    rules: [],
  },
  {
    label: '联系电话',
    prop: 'phone',
    type: 'input',
    itemProps: {
      placeholder: '请填写联系人的电话',
    },
    rules: [],
  },
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
    type: 'petPicker',
    subProp: 'subType',
    itemProps: {
      placeholder: '请选择',
      // required: true,
    },
    options: PET_TYPES,
    rules: [],
  },
  // {
  //   label: '爱宠体重',
  //   prop: 'weight',
  //   type: 'selector',
  //   itemProps: {
  //     placeholder: '请选择',
  //     rangeKey: 'label',
  //   },
  //   options: WEIGHT_OPTIONS,
  // },
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
    invalidTimes: [],
  },
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
        label: '放弃处置',
        value: '3',
      },
    ],
    rules: [],
  },
  // {
  //   label: '',
  //   prop: 'handleWayCheck',
  //   type: 'checkbox',
  //   options: [
  //     {
  //       label: '放弃处置无害化处理后遗留申明',
  //       value: '1',
  //     },
  //   ],
  //   hidden: true,
  // },
  {
    label: '纪念物获取时间',
    prop: 'handleDateTime',
    type: 'picker-date',
    itemProps: {
      placeholder: '请选择',
    },
    rules: [],
    hidden: false,
    timeRange: SERVICE_TIME_RANGES,
    // supportAll: true,
  },

  {
    label: '宠物接收方式',
    prop: 'expressWay',
    type: 'radio',
    options: [],
  },
  {
    label: '门店地址',
    prop: 'expressAddress',
    type: 'text',
    hidden: true,
  },
  // {
  //   label: '上门收取时间',
  //   prop: 'expressDateTime',
  //   itemProps: {
  //     placeholder: '请选择',
  //   },
  //   type: 'picker-date',
  //   timeRange: SERVICE_TIME_RANGES,
  //   hidden: true,
  // },
  {
    label: '选择宠物门店',
    prop: 'petStoreId',
    type: 'selector',
    itemProps: {
      placeholder: '请选择',
      rangeKey: 'label',
    },
    hidden: true, // 控制显示隐藏
    rules: [],
    options: [],
  },
  {
    label: '接收地址',
    prop: 'postAddress',
    // type: "textarea",
    type: 'location',
    hidden: true, // 控制显示隐藏
    itemProps: {
      placeholder: '点击选择位置',
    },
    rules: [],
  },
  {
    label: '门牌号',
    prop: 'detail',
    type: 'input',
    hidden: true,
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
