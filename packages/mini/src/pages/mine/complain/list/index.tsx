import { useEffect, useState } from 'react';
import { View, Text } from '@tarojs/components';
import { navigateTo } from '@tarojs/taro';
import { list } from '@/apis/advise';
import './index.scss';
import { formatDateTime } from '@/utils';

export default function List() {
  const [data, setData] = useState([]);
  const [showEmpty, setShowEmpty] = useState(false);
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
    list().then((res) => {
      if (res?.data) {
        setShowEmpty(!res.data?.length);
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
          <View className="items-center item-head">
            <View className="text-888">
              创建时间：{formatDateTime(item.createdAt)}
            </View>
            {getStatusBg(item)}
          </View>
          <View className="content">{item.content}</View>
          <View className="bottom">点击查看</View>
        </View>
      ))}
      {showEmpty && (
        <View className="empty">
          <Text>暂无数据</Text>
        </View>
      )}
    </View>
  );
}
