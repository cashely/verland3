import { View } from '@tarojs/components';
import Taro, { useLoad } from '@tarojs/taro';
import { AtAvatar, AtButton } from 'taro-ui';
import useLogin from '@/hooks/useLogin';
import { useEffect } from 'react';
import './index.scss';

export default function Index() {
  useLoad(() => {
    console.log('Page loaded.');
  });
  const { isLoggedIn, toLogin } = useLogin();
  const userInfo = Taro.getStorageSync('userInfo'); // 获取用户信息
  const handleLogin = () => {
    console.log('去预约');
    // getUserProfile({
    //   desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
    //   lang: 'zh_CN',
    // });

    if (isLoggedIn) {
      Taro.navigateTo({ url: '/pages/createBook/index' });
    } else {
      toLogin();
    }
  };

  useEffect(() => {
    console.log('Index page rendered.', isLoggedIn);
  }, []);

  return (
    <View className="index pt-20">
      <View className="flex justify-center">
        <AtAvatar image={userInfo?.avatar} className="avatar" size="large" />
      </View>
      <View className="pl-20 pr-20 mt-40">
        <AtButton className="btnBox" circle onClick={handleLogin}>
          马上预约
        </AtButton>
      </View>
    </View>
  );
}
