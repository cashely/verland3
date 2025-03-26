import { View, Text } from '@tarojs/components';
import Taro, { useLoad } from '@tarojs/taro';
import './index.scss';
import { AtList, AtListItem } from 'taro-ui';

export default function Complain() {
  useLoad(() => {
    console.log('Page loaded.');
  });

  return (
    <View className="pages-complain">
      <AtList className="listItem">
        <AtListItem
          title="我要投诉"
          arrow="right"
          onClick={() =>
            Taro.navigateTo({ url: '/pages/mine/complain/create/index' })
          }
        />
        <AtListItem
          title="我的投诉"
          arrow="right"
          onClick={() =>
            Taro.navigateTo({ url: '/pages/mine/complain/list/index' })
          }
        />
      </AtList>
    </View>
  );
}
