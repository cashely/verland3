import { useState } from 'react';
import { View, Text } from '@tarojs/components';
import { navigateTo, useLoad } from '@tarojs/taro';
import { list as bookList } from '@/apis/book';
import { list } from '@/apis/ticket';
import dayjs from 'dayjs';
import './index.scss';

export default function Index() {
  const [data, setData] = useState([]);
  const [pageType, setPageType] = useState('');

  useLoad((option) => {
    const { type } = option;
    console.log('Page loaded.', option);
    setPageType(type);
    if (type === 'kpsq') {
      bookList().then((res) => {
        if (res.code === 200) {
          if (!res.data) return;
          const result = res.data?.filter((item) => item.statu === 0);
          setData(result);
        }
      });
    } else if (type === 'wdsq') {
      list({}).then((res) => {
        if (res.code === 200) {
          setData(res.data);
        }
      });
    }
  });
  const handleClick = (item) => {
    //跳转发票详情
    console.log(item);
    if (pageType === 'wdsq') {
      navigateTo({
        url: `./detail/index?id=${item.id}&payAmount=${item?.book?.payAmount}`,
      });
      return;
    }
    navigateTo({
      url: `../as-invoiceApply/index?id=${item.id}&type=${pageType}&payAmount=${item?.payAmount}`,
    });
  };

  const formatPrice = (price) => {
    if (!price) return '0';
    return Number(price / 100).toLocaleString();
  };

  const formatTime = (time) => {
    if (!time) return '';
    return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
  };

  return (
    <View className="page-invoiceList">
      {data?.map((item, index) => (
        <View
          className={['item', pageType]}
          onClick={() => handleClick(item)}
          key={index}
        >
          <View className="flex title justify-between items-center">
            <Text>{item.menu || item.book?.menu || '-'}</Text>
            <Text className="time">
              {formatTime(item.bookDateTime || item.createdAt) || +new Date()}
            </Text>
          </View>
          <View className="priceCon text-price font-bold">
            {formatPrice(item.payAmount || item.book?.payAmount)}
            <Text className="unit">元</Text>
          </View>
          {pageType === 'wdsq' && (
            <View className="ticket-footer">
              <Text>{item.statu === 2 ? '未开票' : '开票中'}</Text>
              <Text>未收到发票</Text>
            </View>
          )}
        </View>
      ))}
      {data.length === 0 && (
        <View className="empty">
          <Text>暂无数据</Text>
        </View>
      )}
    </View>
  );
}
