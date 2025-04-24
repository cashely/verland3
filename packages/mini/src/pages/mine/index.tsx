import { View, Text } from '@tarojs/components';
import Taro, { getStorageSync, navigateTo } from '@tarojs/taro';
import { AtAvatar, AtListItem, AtList } from 'taro-ui';
import { menuList } from './config';
import './index.scss';
import { useEffect, useState } from 'react';
import relogin from '@/apis/relogin';

export default function Index() {
  const [userInfo, setUserInfo] = useState({
    avatar: '',
    username: '',
  });
  const token = getStorageSync('token');
  const handleGoPage = (item: Record<string, any>) => {
    console.log(item, 'item');
    if (!token) {
      relogin()
        .then((data) => {
          console.log(data, 'data');
          setUserInfo(data);
          if (item?.pagePath) {
            Taro.navigateTo({ url: item.pagePath });
          } else {
            Taro.makePhoneCall({ phoneNumber: item.value });
          }
        })
        .catch(() => {
          goLogin();
        });
    } else {
      Taro.navigateTo({ url: item.pagePath });
    }
  };

  const goLogin = () => {
    navigateTo({ url: `../login/index?type=2` });
  };

  const handleCheckLogin = () => {
    if (!token) {
    }
  };

  useEffect(() => {
    const userInfo = getStorageSync('userInfo');
    if (userInfo) {
      setUserInfo({
        ...userInfo,
        username: userInfo.username,
        avatar: userInfo.avatar,
        gender: userInfo.gender,
      });
    }
  }, []);

  return (
    <View className="page-mine" onClick={handleCheckLogin}>
      <View className="content">
        <View className="header">
          <AtAvatar
            image={userInfo.avatar}
            circle
            className="avatar"
            size="large"
          />
          <Text className="nickname">{userInfo.username || '未登录'}</Text>
        </View>
        <View className="toolsList">
          <AtList>
            {menuList.map((item, index) => (
              <AtListItem
                key={index}
                className="toolsItem"
                title={item.text}
                arrow="right"
                extraText={item.value || ''}
                onClick={() => handleGoPage(item)}
              ></AtListItem>
            ))}
          </AtList>
        </View>
      </View>
    </View>
  );
}
