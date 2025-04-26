import { View, Image } from '@tarojs/components';
import Taro, { clearStorageSync, navigateTo, useDidShow } from '@tarojs/taro';
import { useState } from 'react';
import { AtButton } from 'taro-ui';
import { relogin } from '@/apis/relogin';
import { getUser } from '@/apis/user';
import './index.scss';
import { useEffect } from 'react';

export default function Index() {
  const [userInfo, setUserInfo] = useState({}); // 获取用户信息
  const token = Taro.getStorageSync('token'); // 获取用户信息
  const handleLogin = () => {
    console.log(token, 'userInfo');
    if (!token) {
      relogin()
        .then((_) => {
          navigateTo({ url: '/pages/createBook/index' });
        })
        .catch((_) => {
          navigateTo({ url: '../login/index?type=1' });
          clearStorageSync();
        });
    } else {
      navigateTo({ url: '/pages/createBook/index' });
    }
    // Taro.navigateTo({ url: `/pages/createBook/index` });
  };

  useDidShow(() => {
    const userInfo = Taro.getStorageSync('userInfo');
    setUserInfo(userInfo);
  });

  return (
    <View className="index">
      <View className="flex justify-center">
        <Image src={userInfo?.avatar} className="avatar" />
      </View>
      <View className="pl-20 pr-20 mt-40">
        <AtButton className="btnBox" circle onClick={handleLogin}>
          马上预约
        </AtButton>
      </View>
    </View>
  );
}
