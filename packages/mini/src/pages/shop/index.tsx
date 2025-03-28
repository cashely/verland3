import { View, Text } from '@tarojs/components';
import './index.scss';
export default function Index() {
  console.log(process.env.TARO_APP_API);

  return (
    <View className="index">
      <Text>功能开发中...</Text>
    </View>
  );
}
