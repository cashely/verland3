import { View, Text, Button } from '@tarojs/components';
import Taro, { useLoad } from '@tarojs/taro';
import { getUserInfo } from '@/apis/mine';
export default function Index() {
  useLoad(() => {
    console.log('Page loaded.');
  });
  console.log(process.env.TARO_APP_API);
  const handleLogin = () => {
    console.log('登录');
    //判断登录是否失效
    Taro.checkSession({
      success: () => {
        console.log('已登录');
      },
      fail: () => {
        console.log('未登录');
      },
    });

    getUserInfo({}).then((res) => {
      console.log(res);
    });

    // Taro.request({
    //   url: 'http://localhost:3000/mp/user?token=Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Ind4aWQiOiJvYk5FTjZGaGdHb3RmWHZ6QV82djNkMTkwb0NVIiwiaWQiOiIwMTk0ZWI1Ni0yZjA3LTc4OTMtOGZlZS1kNDgyNTVhMzI3NDIifSwiZXhwIjoxNzM5MjAxNDgxLCJpYXQiOjE3MzkxMTUwODF9.SwxEQq03oA4YrLkG98MYeYoCtEIjjGqD0OwzZCznl1Y',
    //   method: 'GET',
    //   success: (res) => {
    //     console.log(res);
    //   }
    // })

    // Taro.login({
    //   success: (res) => {
    //     console.log(res);
    //     if(res.code) {

    //       // 发送 res.code 到后台换取 openId, sessionKey, unionId

    //     }
    //   }
    // })
  };

  return (
    <View className="index">
      <Text>商1城</Text>
      <Button onClick={handleLogin}>登录 </Button>
    </View>
  );
}
