import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './index.scss';
import { AtList, AtListItem } from 'taro-ui';

export default function Complain() {
  return (
    <View className="pages-complain">
      <AtList>
        <AtListItem
          className="listItem"
          title="我要投诉"
          arrow="right"
          onClick={() =>
            Taro.navigateTo({ url: '/pages/mine/complain/create/index' })
          }
        />
        <AtListItem
          title="我的投诉"
          className="listItem"
          arrow="right"
          onClick={() =>
            Taro.navigateTo({ url: '/pages/mine/complain/list/index' })
          }
        />
      </AtList>
    </View>
  );
}
