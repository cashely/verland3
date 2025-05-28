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
    type: 'digit',
    itemProps: {
      placeholder: '请填写联系人的电话',
      maxLength: 11,
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
    tabsTitle: [],
    tabsOptions: [],
    rules: [],
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
  {
    label: '上门服务时间', //"上门服务日期",
    prop: 'bookDateTime',
    type: 'picker-date',
    itemProps: {
      placeholder: '请选择',
    },
    rules: [],
    hidden: true,
    timeRange: SERVICE_TIME_RANGES,
    invalidTimes: [],
  },
  {
    label: '收取地址',
    prop: 'postAddress',
    // type: "textarea",
    type: 'location',
    hidden: true, // 控制显示隐藏
    itemProps: {
      mark: '请补充完整地址，例1层101室',
      placeholder: '点击选择位置',
    },
    rules: [],
  },
  {
    label: '门牌号',
    prop: 'detail',
    type: 'textarea',
    hidden: true,
    itemProps: {
      maxLength: 50,
      placeholder: '详细地址，要求小区名称,例某某小区1层101室',
    },
    rules: [],
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
      placeholder: '请选择',
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
    hidden: false,
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
      mark: '请在订单完成后与客服确认时间',
    },
    rules: [],
    hidden: false,
    timeRange: SERVICE_TIME_RANGES,
    // supportAll: true,
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
    label: '备注',
    prop: 'mark',
    type: 'textarea',
    itemProps: {
      count: true,
      height: 200,
      placeholder: '请输入',
    },
    rules: [],
  },
];

export { otherFormList, baseInfoFormList };
