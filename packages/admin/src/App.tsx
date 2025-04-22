import './App.css';
import { ConfigProvider, App as AntdApp } from 'antd';
import zhCN from 'antd/es/locale/zh_CN'; // 引入中文配置
import Router from './router';
import 'dayjs/locale/zh-cn'; // 引入中文语言包
import useTheme from '@/hooks/themeContext';
import dayjs from 'dayjs';
dayjs.locale('zh-cn'); // 设置语言

function App() {
  const customLocale = {
    ...zhCN,
    DatePicker: {
      ...zhCN.DatePicker,
      placeholder: '请选择日期', // 修改日期选择器的占位符
    },
    Pagination: {
      ...zhCN.Pagination,
      items_per_page: '/页', // 修改分页显示文案
    },
  };
  const { theme } = useTheme();
  return (
    <ConfigProvider
      locale={customLocale}
      theme={{
        token: {
          borderRadius: 0,
          borderRadiusLG: 0,
          borderRadiusSM: 0,
          colorPrimary: theme.primary,
          fontSize: 12,
          colorLink: theme.primary,
          colorText: '#666',
        },
        components: {
          Card: {
            bodyPadding: 16,
            headerPadding: 16,
          },
        },
      }}
    >
      <AntdApp>
        <Router />
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;
