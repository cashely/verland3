import { PropsWithChildren, useState } from 'react';
import { useLaunch, navigateTo } from '@tarojs/taro';
import AppContext from '@/hooks/useContext';
import 'virtual:windi.css';
import './assets/css/_taro.scss';
import 'taro-ui/dist/style/index.scss'; // 全局引入一次即可
import '@nutui/nutui-react-taro/dist/styles/themes/default.css';
import { relogin } from '@/apis/relogin';
import './app.scss';
// import "windi.css";

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    console.log('App launched.');
    // relogin().catch(() => {
    //   console.log('Login failed.');
    //   navigateTo({
    //     url: '/pages/login/index',
    //   });
    // });
  });
  const [appData] = useState<any>({ menuList: [], test: 1 });

  /*useEffect(() => {
    menu().then((res) => {
      console.log('menu', res);
      if (res?.code === 200) {
        setAppData((d) => ({
          ...d,
          menuList: res?.data || [],
        }));
      }
    });
  }, []);*/
  // children 是将要会渲染的页面
  return <AppContext.Provider value={appData}>{children}</AppContext.Provider>;
}

App.taroGlobalData = {
  a: {},
};

export default App;
