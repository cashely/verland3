import { View, Text } from '@tarojs/components';
import Taro, { getStorageSync, navigateTo, useDidShow } from '@tarojs/taro';
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
    if (item.isPhone) {
      Taro.makePhoneCall({
        phoneNumber: item.value,
      });
      return;
    }
    if (!token) {
      relogin()
        .then((data) => {
          setUserInfo(data);
          if (item?.pagePath) {
            Taro.navigateTo({ url: item.pagePath });
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

  useDidShow(() => {
    const userInfo = getStorageSync('userInfo');
    if (userInfo) {
      setUserInfo({
        ...userInfo,
        username: userInfo.username,
        avatar: userInfo.avatar,
        gender: userInfo.gender,
      });
    }
  });

  return (
    <View className="page-mine">
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
                arrow={item.isPhone ? undefined : 'right'}
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
