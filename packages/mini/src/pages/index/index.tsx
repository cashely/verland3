import { View } from '@tarojs/components';
import Taro, { navigateTo } from '@tarojs/taro';
import { AtAvatar, AtButton } from 'taro-ui';
import './index.scss';

export default function Index() {
  // const { isLoggedIn, toLogin } = useLogin();
  const token = Taro.getStorageSync('token'); // 获取token

  const userInfo = Taro.getStorageSync('userInfo'); // 获取用户信息
  const handleLogin = () => {
    if (!token) {
      navigateTo({ url: '../login/index?type=1' });
      return;
    }
    Taro.navigateTo({ url: `/pages/createBook/index` });
  };

  return (
    <View className="index">
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
