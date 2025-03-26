import { View } from '@tarojs/components';
import { AtListItem, AtList } from 'taro-ui';
import { navigateTo } from '@tarojs/taro';
import './index.scss';

export default function Index() {
  const goPage = (url: string, type) => {
    navigateTo({ url: url + '?type=' + type });
  };
  return (
    <View className="pages-afterSales">
      <AtList>
        <AtListItem
          className="listItem"
          key="1"
          title="开票申请"
          arrow="right"
          onClick={() =>
            goPage('/pages/mine/afterSales/as-invoice/index', 'kpsq')
          }
        ></AtListItem>
        <AtListItem
          key="2"
          className="listItem"
          title="我的申请"
          arrow="right"
          onClick={() =>
            goPage('/pages/mine/afterSales/as-invoice/index', 'wdsq')
          }
        ></AtListItem>
      </AtList>
    </View>
  );
}
