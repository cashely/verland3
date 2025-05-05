import { useEffect, useState } from 'react';
import { View, Text } from '@tarojs/components';
import {
  navigateTo,
  useLoad,
  setNavigationBarTitle,
  showToast,
} from '@tarojs/taro';
import { list as bookList } from '@/apis/book';
import { list } from '@/apis/ticket';
import { TICKET_STATUS_TYPE } from '@/constants';
import { formatPrice, formatDateTime } from '@/utils';
import dayjs from 'dayjs';
import './index.scss';

export default function Index() {
  const [data, setData] = useState([]);
  const [pageType, setPageType] = useState('');
  const [showEmpty, setShowEmpty] = useState(false);
  useLoad((option) => {
    const { type } = option;
    setPageType(type);
  });

  const getBookList = () => {
    const start = dayjs().startOf('year').format('YYYY/MM/DD HH:mm:ss');
    const end = dayjs().endOf('year').format('YYYY/MM/DD HH:mm:ss');
    bookList({
      start,
      end,
      statu: 3,
    }).then((res) => {
      if (res.code === 200) {
        if (!res.data) return;
        const result = res.data;
        setShowEmpty(!result.length);
        setData(result);
      }
    });
  };

  const getTicketList = () => {
    list({}).then((res) => {
      if (res.code === 200) {
        setData(res.data);
        setShowEmpty(!res.data?.length);
      }
    });
  };

  useEffect(() => {
    console.log(pageType, 'pageType');
    if (pageType === 'kpsq') {
      getBookList();
      setNavigationBarTitle({
        title: '订单列表',
      });
    } else if (pageType === 'wdsq') {
      getTicketList();
      setNavigationBarTitle({
        title: '申请列表',
      });
    }
  }, [pageType]);
  const handleClick = (item) => {
    //跳转发票详情
    if (pageType === 'wdsq') {
      navigateTo({
        url: `./detail/index?id=${item.id}&totalAmount=${item?.book?.totalAmount}`,
      });
      return;
    } else {
      if (item.ticket?.id) {
        return showToast({
          title: '已申请开票',
          icon: 'none',
          duration: 1000,
        });
      }
      navigateTo({
        url: `../as-invoiceApply/index?id=${item.id}&type=${pageType}&totalAmount=${item?.totalAmount}`,
      });
    }
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
            <Text>{item?.menu?.name || item?.book?.menu?.name || '-'}</Text>
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
      {showEmpty && (
        <View className="empty">
          <Text>暂无数据</Text>
        </View>
      )}
    </View>
  );
}
