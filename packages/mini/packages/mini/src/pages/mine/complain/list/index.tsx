import { useEffect, useState } from 'react';
import { View, Text } from '@tarojs/components';
import { useLoad, navigateTo } from '@tarojs/taro';
import { list } from '@/apis/advise';
import './index.scss';
import dayjs from 'dayjs';

export default function List() {
  useLoad(() => {
    console.log('Page loaded.');
  });

  const [data, setData] = useState([]);
  const formatDay = (day: string) => {
    if (!day) return '';
    return dayjs(day).format('YYYY-MM-DD HH:mm:ss');
  };
  const getStatusBg = (item) => {
    const obj = {
      0: {
        label: '处理中',
        bgClass: 'yy',
      },
      1: {
        label: '已反馈',
        bgClass: 'wc',
      },
    };
    const statu = item.replayContent ? 1 : 0;
    return (
      <View className={[obj[statu]?.bgClass, 'status-bg'].join(' ')}>
        <Text className="txt">{obj[statu]?.label}</Text>
      </View>
    );
  };

  useEffect(() => {
    console.log('getApi loaded.');

    list().then((res) => {
      console.log(res);
      if (res?.data) {
        setData(res.data);
      }
    });
  }, []);

  return (
    <View className="page-complain-list">
      {data.map((item, index) => (
        <View
          className="item"
          key={index}
          onClick={() =>
            navigateTo({
              url: `./detail/index?id=${item.id}`,
            })
          }
        >
          <View className="item-head items-center">
            <View className="text-888">预：{formatDay(item.createdAt)}</View>
            {getStatusBg(item)}
          </View>
          <View className="content">{item.content}</View>
          <View className="bottom">点击查看</View>
        </View>
      ))}
    </View>
  );
}
