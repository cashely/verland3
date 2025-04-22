import { useState } from 'react';
import { View, Image } from '@tarojs/components';
import { useLoad, redirectTo } from '@tarojs/taro';
import payResult from '../../../subpackages/assets/images/payResult.png';
import './index.scss';

export default function OtherBookService() {
  const [id, setId] = useState('');
  useLoad((option) => {
    if (option?.id) {
      setId(option.id);
    }
  });

  const goView = () => {
    // 跳转我的预约
    redirectTo({
      url: '/pages/mine/appointList/detail/index?id=' + id,
    });
  };
  return (
    <View className="page-payResult">
      <View className="absolute image-box">
        <Image
          mode="widthFix"
          src={payResult}
          className="result-image "
          style={{
            width: '100%',
          }}
        />
        <View className="text-center con">
          <View className="title">
            感谢您选择我们的服务。我们将及时跟进您的订单，请留意接听客服电话：19120038398(企业微信同号)
          </View>
          <View className="desc" onClick={goView}>
            查看我的预约
          </View>
        </View>
      </View>
    </View>
  );
}
