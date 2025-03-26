import { View, Text } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { AtAvatar, AtListItem, AtList } from 'taro-ui';
import { menuList } from './config';
import useLogin from '@/hooks/useLogin';
import './index.scss';

export default function Index() {
  const { isLoggedIn, userInfo, toLogin } = useLogin();

  const handleGoPage = (item: Record<string, any>) => {
    //判断有没有登录
    if (isLoggedIn) {
      if (item?.pagePath) {
        Taro.navigateTo({ url: item.pagePath });
      } else {
        Taro.makePhoneCall({ phoneNumber: item.value });
      }
    } else {
      toLogin();
    }
  };

  return (
    <View className="page-mine">
      <View className="content">
        <View className="header" onClick={toLogin}>
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
