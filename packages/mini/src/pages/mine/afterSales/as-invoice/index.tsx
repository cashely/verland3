import { useState } from 'react';
import { View, Text } from '@tarojs/components';
import { navigateTo, useLoad } from '@tarojs/taro';
import { list as bookList } from '@/apis/book';
import { list } from '@/apis/ticket';
import { TICKET_STATUS_TYPE } from '@/constants';
import { formatPrice, formatDateTime } from '@/utils';
import './index.scss';

export default function Index() {
  const [data, setData] = useState([]);
  const [pageType, setPageType] = useState('');
  useLoad((option) => {
    const { type } = option;
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
        url: `./detail/index?id=${item.id}&totalAmount=${item?.book?.totalAmount}`,
      });
      return;
    }
    navigateTo({
      url: `../as-invoiceApply/index?id=${item.id}&type=${pageType}&totalAmount=${item?.totalAmount}`,
    });
  };

  return (
    <View className="page-invoiceList">
      {data?.map((item, index) => (
        <View
          className={`item ${pageType}`}
          onClick={() => handleClick(item)}
          key={index}
        >
          <View className="flex items-center justify-between title">
            <Text>{item.menu?.name || '-'}</Text>
            <Text className="time">
              {formatDateTime(item.bookDateTime || item.createdAt)}
            </Text>
          </View>
          <View className="font-bold priceCon text-price">
            {item?.book
              ? formatPrice(item.book?.totalAmount)
              : formatPrice(item.totalAmount)}
            <Text className="unit">元</Text>
          </View>
          {pageType === 'wdsq' && (
            <View className="ticket-footer">
              <Text>{TICKET_STATUS_TYPE[item.statu]}</Text>
              {/* <Text>未收到发票</Text> */}
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
