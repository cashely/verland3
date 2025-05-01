import { useState } from 'react';
import { View, Text, Image } from '@tarojs/components';
import { useLoad } from '@tarojs/taro';
import { AtAvatar, AtListItem, AtList } from 'taro-ui';
import { detail } from '@/apis/book';
import dayjs from 'dayjs';
import { formatPrice } from '@/utils';
import {
  IS_RITE,
  HANDLE_WAYS,
  PET_RECEIVE_WAYS,
  APPOINTMENT_TYPES,
} from '@/constants';
import './index.scss';

const rowsData = [
  {
    label: '基础服务',
    key: 'menu',
  },
  {
    label: '下单时间',
    key: 'createdAt',
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
    label: '宠物接收方式',
    key: 'expressWay',
  },
  {
    label: '预约服务时间',
    key: 'bookDateTime',
  },
  {
    label: '是否需要仪式',
    key: 'isRite',
  },
  {
    label: '预约仪式时间',
    key: 'riteDateTime',
  },
  {
    label: '纪念物获取方式',
    key: 'handleWay',
  },
  {
    label: '纪念物获取时间',
    key: 'handleDateTime',
  },

  {
    label: '门店地址',
    key: 'petStore',
  },
  {
    label: '上门收取地址',
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

  useLoad((option) => {
    if (option?.id) {
      console.log('option', option);

      detail(option.id).then((res) => {
        if (res.code === 200) {
          const result = res.data;
          if (!result) return;
          setInfo({
            ...result,
            local:
              result?.address && result.expressWay == 3
                ? `${result?.address?.province} ${result?.address?.city} ${result?.address?.area}`
                : null,
            petname: result.pet?.petname,
            createdAt: result.createdAt
              ? dayjs(result.createdAt).format('YYYY-MM-DD HH:mm:ss')
              : undefined,
            bookDateTime: result.bookDateTime
              ? dayjs(result.bookDateTime).format('YYYY-MM-DD HH:mm:ss')
              : undefined,
            isRite: IS_RITE.find((n) => n.value == result.isRite)?.label || '-',
            showRiteDateTime: result.menu?.isRite === 1 ? true : false,
            riteDateTime: result.riteDateTime
              ? dayjs(result.riteDateTime).format('YYYY-MM-DD HH:mm:ss')
              : undefined,
            expressWay:
              PET_RECEIVE_WAYS.find((n) => n.value == result.expressWay)
                ?.label || undefined,
            handleWay:
              HANDLE_WAYS.find((n) => n.value == result.handleWay)?.label ||
              undefined,
            handleDateTime: result.handleDateTime
              ? dayjs(result.handleDateTime).format('YYYY-MM-DD HH:mm:ss')
              : undefined,
            petStore:
              result?.petStore?.name && result.expressWay == 2
                ? `${result?.petStore?.name}-${result?.petStore?.address}`
                : result.expressWay === 1
                ? '广东省广州市海珠区仑头路78号之3A01栋108铺'
                : undefined,
            detail: (result.expressWay == 3 && result?.address?.detail) || '',

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
        <Image
          src={APPOINTMENT_TYPES[info.statu]?.icon}
          mode="widthFix"
          style={{
            width: '40px',
            height: '40px',
          }}
          className="mx-auto"
        ></Image>
        <View
          className="mt-10"
          style={{
            color: '#72C8F6',
          }}
        >
          {APPOINTMENT_TYPES[info.statu]?.label}
        </View>
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
              ) : info?.[item.key] && item.key !== 'isRite' ? (
                info?.[item.key] ? (
                  <AtListItem
                    className="detail-item"
                    title={item.label}
                    extraText={
                      <>
                        {['bookGoods'].includes(item.key) &&
                        !info?.[item.key]?.length
                          ? '暂无'
                          : info[item.key] || '暂无'}
                      </>
                    }
                  ></AtListItem>
                ) : null
              ) : info?.showRiteDateTime ? (
                <AtListItem
                  className="detail-item"
                  title={item.label}
                  extraText={
                    <>
                      {['bookGoods'].includes(item.key) &&
                      !info?.[item.key]?.length
                        ? '暂无'
                        : info[item.key] || '暂无'}
                    </>
                  }
                ></AtListItem>
              ) : null}
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
