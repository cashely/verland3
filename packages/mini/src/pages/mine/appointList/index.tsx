import { useEffect, useState } from 'react';
import { View, Text, Image } from '@tarojs/components';
import {
  navigateTo,
  useDidShow,
  showToast,
  requestSubscribeMessage,
} from '@tarojs/taro';
import {
  AtAvatar,
  AtRate,
  AtTabs,
  AtTabsPane,
  AtActionSheet,
  AtTextarea,
  AtButton,
} from 'taro-ui';
import { evaluate, list, cancel } from '@/apis/book';
import sheetCat from '../../../subpackages/assets/images/sheetCat.png';
import dayjs from 'dayjs';
import { APPOINTMENT_TYPES, DEFAULT_IMAGE, REFUND_TMP } from '@/constants';
import { formatPrice } from '@/utils';
import { fileUrl } from '@/apis';
import './index.scss';

const tabList = [
  { title: '全部' },
  { title: '待付款' },
  { title: '已预约' },
  { title: '待寄送' },
  { title: '已完成' },
  { title: '已取消' },
  { title: '异常' },
  { title: '退款中' },
];

export default function Index() {
  useDidShow(() => {
    getlist();
  });
  const [current, setCurrent] = useState(0);
  const [data, setData] = useState([]);
  const [isOpened, setIsOpened] = useState(false);
  const [context, setContext] = useState('');
  const [rateValue, setRate] = useState(5);
  const [bookId, setBookId] = useState('');
  const getlist = async (current = 0) => {
    const res = await list();
    if (res.code === 200) {
      const result = res.data.map((item) => ({
        ...item,
        bookDateTime: dayjs(item.bookDateTime).format('YYYY-MM-DD HH:mm:ss'),
      }));

      setData(
        current !== 0
          ? result.filter((item) => item.statu === current - 1)
          : result
      );
      setCurrent(+current);
    }
  };
  const handleTabClick = (value) => {
    getlist(value);
  };

  const handleChange = (value) => {
    setContext(value);
  };
  // 待付款  已预约  待寄送  已完成  已取消
  const getStatusBg = (current) => {
    return (
      <View
        className={[APPOINTMENT_TYPES[current]?.bgClass, 'status-bg'].join(' ')}
      >
        <Text className="txt">{APPOINTMENT_TYPES[current]?.label}</Text>
      </View>
    );
  };

  const handleEvalClick = (item: any) => {
    setBookId(item.id);
    if (item.evaluate?.id) {
      showToast({
        title: '已评价',
        icon: 'none',
      });
      return;
    }
    setIsOpened(true);
  };

  const onCancel = (item) => {
    //退款消息订阅
    requestSubscribeMessage({
      tmplIds: [REFUND_TMP],
      entityIds: [],
      complete() {
        cancel(item.id).then((res) => {
          if (res.code === 200) {
            showToast({
              title: '取消成功',
              icon: 'none',
              success() {
                setTimeout(() => {
                  getlist();
                }, 1000);
              },
            });
          }
        });
      },
    });
  };

  const handleRateChange = (value) => {
    setRate(value);
  };

  const handleSubmit = () => {
    evaluate({
      bookId,
      score: rateValue,
      content: context,
    }).then((res) => {
      if (res.code === 200) {
        showToast({
          title: '评价成功',
          icon: 'none',
          success() {
            setTimeout(() => {
              setIsOpened(false);
              getlist();
            }, 1000);
          },
        });
      }
    });
  };
  const handleToInvoice = (item: any) => {
    if (item.ticket?.id) {
      return showToast({
        title: '已申请发票',
        icon: 'none',
      });
    }
    navigateTo({
      url: `/pages/mine/afterSales/as-invoiceApply/index?id=${item.id}&totalAmount=${item.totalAmount}`,
    });
  };

  const handleCreateBook = () => {
    navigateTo({
      url: `/pages/createBook/index`,
    });
  };

  const handleToDetail = (item) => {
    console.log(item);
    if (!item?.id) return;
    navigateTo({
      url: `./detail/index?id=${item.id}&statuName=${
        APPOINTMENT_TYPES[item.statu]?.label
      }`,
    });
  };

  const showImage = (path: string) => {
    if (!path) return;
    return fileUrl + '/' + path;
  };

  return (
    <View className="page-appointList">
      <AtTabs current={current} tabList={tabList} onClick={handleTabClick}>
        {tabList.map((_, index) => (
          <AtTabsPane current={current} index={index}>
            <View className="tab-content" key={index}>
              {data.map((item, indey) => (
                <View className="relative bg-red-700 item" key={indey}>
                  <View className="items-center item-head">
                    <View className="text-888">
                      预约日期：{item.bookDateTime}
                    </View>
                    {getStatusBg(item.statu)}
                  </View>
                  <View className="item-body">
                    <AtAvatar
                      size="large"
                      image={
                        showImage(item?.menu?.images?.[0]?.image?.path) ||
                        DEFAULT_IMAGE
                      }
                    ></AtAvatar>
                    <View className="ml-20 item-body-right">
                      <View className="mb-10 title">
                        {item.menu?.name}
                        <Text className="text-price">
                          ¥{formatPrice(item.totalAmount)}
                        </Text>
                      </View>
                      <View className="mb-10 info">
                        附加服务：
                        <Text className="text-888">
                          {item?.bookGoods
                            ?.map((n) => n.bookGood.title)
                            .join(',') || '无'}
                        </Text>
                      </View>
                      <View>
                        实际支付：
                        <Text className="text-price">
                          ¥{formatPrice(item.totalAmount)}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View className="absolute bottom-0 left-0 right-0 item-foot">
                    {[1, 2].includes(item.statu) && (
                      <View
                        className="btn-item"
                        onClick={() => onCancel(item)}
                        style="background-color:#C1E9EE"
                      >
                        取消预约
                      </View>
                    )}

                    {[3].includes(item.statu) && (
                      <>
                        <View
                          className="btn-item"
                          style="background-color:#C1E9EE"
                          onClick={() => handleEvalClick(item)}
                        >
                          {item?.evaluate?.id ? '已评价' : '评价'}
                        </View>
                        <View
                          className="btn-item"
                          style="background-color:#ffc7c7"
                          onClick={() => handleToInvoice(item)}
                        >
                          {item?.ticket?.id ? '已申请发票' : '发票申请'}
                        </View>
                      </>
                    )}
                    {[4].includes(item.statu) && (
                      <View
                        className="btn-item"
                        style="background-color:#C1E9EE"
                        onClick={handleCreateBook}
                      >
                        重新预约
                      </View>
                    )}
                    <View
                      className="btn-item text-[#101010]"
                      style="background-color:#FFCE81"
                      onClick={() => handleToDetail(item)}
                    >
                      查看详情
                    </View>
                  </View>
                </View>
              ))}
              {!data?.length && <View className="text-center">暂无数据</View>}
            </View>
          </AtTabsPane>
        ))}
      </AtTabs>
      <AtActionSheet isOpened={isOpened} onClose={() => setIsOpened(false)}>
        <Image
          className={'sheetImage absolute top-[-50px]'}
          mode="widthFix"
          src={sheetCat}
          style={{ width: 100 }}
        ></Image>
        <View className="sheetContent p-40px pb-60px">
          <AtTextarea
            className="cls-textarea"
            value={context}
            onChange={handleChange}
            maxLength={200}
            placeholder="感谢留下宝贵评价"
          ></AtTextarea>
          <AtRate
            value={rateValue}
            className="mt-20px"
            onChange={handleRateChange}
          />
          <AtButton
            className="submitBtn"
            type="primary"
            circle
            size="small"
            onClick={handleSubmit}
          >
            提交
          </AtButton>
        </View>
      </AtActionSheet>
    </View>
  );
}
