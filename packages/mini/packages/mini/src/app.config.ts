export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/shop/index',
    'pages/mine/index',
    'pages/createBook/index',
    'pages/createBook/additionalService/index',
    'pages/createBook/order/index',
    'pages/createBook/payResult/index',
    'pages/mine/complain/index',
    'pages/mine/complain/list/index',
    'pages/mine/complain/create/index',
    'pages/mine/complain/list/detail/index',
    'pages/mine/pets/index',
    'pages/mine/pets/add/index',
    'pages/mine/profile/index',
    'pages/mine/appointList/index',
    'pages/mine/appointList/detail/index',
    'pages/mine/afterSales/index',
    'pages/mine/afterSales/as-invoiceApply/index',
    'pages/mine/afterSales/as-invoice/index',
    'pages/mine/afterSales/as-invoice/detail/index',
  ],
  subpackages: [
    {
      root: 'subpackages',
      name: 'static',
      pages: ['pages/test/index'],
    },
  ],
  tabBar: {
    list: [
      {
        pagePath: 'pages/shop/index',
        text: '商城',
        iconPath: 'assets/icon/shop.png',
        selectedIconPath: 'assets/icon/shop.png',
      },
      {
        pagePath: 'pages/index/index',
        text: '它念',
        iconPath: 'assets/icon/home.png',
        selectedIconPath: 'assets/icon/home_active.png',
      },
      {
        pagePath: 'pages/mine/index',
        text: '个人中心',
        iconPath: 'assets/icon/mine.png',
        selectedIconPath: 'assets/icon/mine_active.png',
      },
    ],

    color: '#d8d8d8',
    selectedColor: '#1C3762',
  },
  window: {
    backgroundTextStyle: 'light', // 下拉loading的样式，仅支持 dark / light
    navigationBarBackgroundColor: '#72C8F6',
    navigationBarTitleText: 'LoveIt',
    navigationBarTextStyle: 'black',
  },
  networkTimeout: {
    request: 10000,
    downloadFile: 10000,
  },
  lazyCodeLoading: 'requiredComponents', // 延迟加载 页面无法加载
  style: 'v2', // 使用2.0版本的样式
  requiredPrivateInfos: ['getLocation', 'chooseLocation'],
  permission: {
    'scope.userLocation': {
      desc: '您的位置信息将用于小程序位置接口的效果展示',
    },
  },
});
