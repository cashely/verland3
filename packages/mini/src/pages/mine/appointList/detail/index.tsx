import { useState } from 'react';
import { View, Text } from '@tarojs/components';
import { useLoad } from '@tarojs/taro';
import { AtAvatar, AtListItem, AtList } from 'taro-ui';
import { detail } from '@/apis/book';
import dayjs from 'dayjs';
import { formatPrice } from '@/utils';
import { DEFAULT_IMAGE } from '@/constants';
import './index.scss';

const rowsData = [
  {
    label: '基础服务',
    key: 'menu',
  },
  {
    label: '下单时间',
    key: 'bookDateTime',
  },
  {
    label: '联系人',
    key: 'username',
  },
  {
    label: '联系电话',
    key: 'phone',
  },
  {
    label: '爱宠名字',
    key: 'petname',
  },
  {
    label: '预约时间',
    key: 'bookDateTime',
  },
  {
    label: '接收地址',
    key: 'local',
  },
  {
    label: '门牌号',
    key: 'detail',
  },
  {
    label: '附加服务',
    key: 'bookGoods',
  },
  {
    label: '备注',
    key: 'mark',
  },
];
// 预约详情
export default function Index() {
  const [info, setInfo] = useState({});
  const [statuName, setStatuName] = useState('');
  useLoad((option) => {
    if (option?.id) {
      setStatuName(option?.statuName);
      detail(option.id).then((res) => {
        if (res.code === 200) {
          const result = res.data;
          if (!result) return;
          setInfo({
            ...result,
            local: `${result.address.province} ${result?.address?.city} ${result?.address.area}`,
            petname: result.pet?.petname,
            bookDateTime: dayjs(result.bookDateTime).format(
              'YYYY-MM-DD HH:mm:ss'
            ),
            handleDateTime: dayjs(result.handleDateTime).format(
              'YYYY-MM-DD HH:mm:ss'
            ),
            detail: result.address.detail,
            pet: undefined,
            address: undefined,
            bookGoods:
              result.bookGoods?.map((n) => n.bookGood?.title || '') || [],
          });
        }
      });
    }
  });

  return (
    <View className="page-appointDetail">
      <View className="text-center header">
        <AtAvatar circle image={DEFAULT_IMAGE} className="mx-auto"></AtAvatar>
        <View className="mt-10">{statuName}</View>
      </View>
      <View className="body">
        <AtList>
          {rowsData?.map((item) => (
            <View>
              {item.key === 'menu' ? (
                <AtListItem
                  className="detail-item"
                  title={item.label}
                  extraText={info?.[item.key]?.name || '-'}
                ></AtListItem>
              ) : (
                <AtListItem
                  className="detail-item"
                  title={item.label}
                  extraText={
                    <>
                      {['bookGoods'].includes(item.key) &&
                      !info?.[item.key]?.length
                        ? '-'
                        : info[item.key] || '-'}
                    </>
                  }
                ></AtListItem>
              )}
              {['bookGoods'].indexOf(item.key) > -1 ? (
                info?.[item.key]?.length ? (
                  <View className="subInfo">
                    {info?.[item.key]?.map((title) => {
                      return <View className="sub-item">{title}</View>;
                    })}
                  </View>
                ) : null
              ) : null}
            </View>
          ))}
        </AtList>
        <View className="text-right footer">
          <Text className="text-price">
            总金额: ¥{formatPrice(info.totalAmount)}
          </Text>
        </View>
      </View>
    </View>
  );
}
