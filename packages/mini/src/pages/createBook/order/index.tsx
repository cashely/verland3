import { Checkbox, View, CheckboxGroup, Label, Text } from '@tarojs/components';
import { useState } from 'react';
import { AtList, AtListItem, AtButton } from 'taro-ui';
import {
  reLaunch,
  useLoad,
  removeStorageSync,
  showToast,
  requestPayment,
  requestSubscribeMessage,
  getSetting,
  openSetting,
} from '@tarojs/taro';
import { detail, prepay, pay } from '@/apis/book';
import { formatPrice } from '@/utils';
import dayjs from 'dayjs';
import { debounce } from 'lodash-es';
import './index.scss';

export default () => {
  const [order, setOrder] = useState({
    orderId: '',
    username: '',
    phone: '',
    petname: '',
    pet: {
      petname: '',
    },
    menu: {
      name: '',
    },
    bookDateTime: '',
    address: {
      detail: '',
    },
    bookGoods: [],
    mark: '',
    payAmount: '',
  });
  const [agreement, setAgreement] = useState(false);
  const [payDisabled, setPayDisabled] = useState(false);
  useLoad((option) => {
    console.log(option);

    if (option?.id) {
      detail(option?.id).then((res) => {
        console.log(res, 'order updated');
        //setOrder({...order,book:res.data.book})
        if (res.code === 200) {
          setOrder({
            ...order,
            ...res.data,
          });
        }
      });
    }
  });

  const formatDate = (date) => {
    if (!date) return '-';
    return dayjs(date).format('YYYY-MM-DD HH:mm');
  };

  const getAddress = (address) => {
    if (!address?.id) return '-';
    return `${address.province}${address.city}${address.area || '-'}`;
  };

  const handleChange = (e) => {
    setAgreement(e.detail.value[0] === '1');
    // setOrder({ ...order, book: e.detail.value.join(',') });
  };

  const handlePay = debounce(() => {
    if (!agreement) {
      return showToast({
        title: '请勾选商品支付协议',
        icon: 'none',
      });
    }
    handlePrepay();
    console.log('开始支付');
    //退款状态模版id都是一次性模版
    const refundTmpId = 'XKQpCEj93wAHPxWaQoET5UwYHkHHnCDP_K4YtOeRpkY';
    const tmpId = 'fIijh96IYidJFYVTWwW2FsvEu2b7yKaQ7MO9FDv8M7U';
    //判断授权状况
    // getSetting({
    //   withSubscriptions: true,
    //   success(res) {
    //     console.log(res, '+++++');
    //     if (res.subscriptionsSetting.mainSwitch) {
    //       // 用户打开了订阅消息总开关
    //       if (res.subscriptionsSetting?.itemSettings) {
    //         // 用户同意总是保持是否推送消息的选择, 这里表示以后不会再拉起推送消息的授权
    //         let moIdState = res.subscriptionsSetting.itemSettings[refundTmpId];
    //         // 如果用户已经同意
    //         console.log(moIdState, 'moIdState');

    //         if (moIdState === 'accept') {
    //           requestSubscribeMessage({
    //             tmplIds: [refundTmpId, tmpId],
    //             entityIds: [refundTmpId, tmpId],
    //             complete() {
    //               console.log(1);
    //               // handlePrepay();
    //             },
    //           });
    //         } else if (moIdState === 'reject') {
    //           showToast({
    //             title: '拒绝了消息推送',
    //             icon: 'none',
    //           });
    //           openSetting({
    //             withSubscriptions: true,
    //           });
    //         } else if (moIdState === 'ban') {
    //           showToast({
    //             title: '已被封禁',
    //             icon: 'none',
    //           });
    //         }
    //       } else {
    //         //没有订阅过消息
    //         requestSubscribeMessage({
    //           tmplIds: [refundTmpId, tmpId],
    //           entityIds: [refundTmpId, tmpId],
    //           success(res) {
    //             console.log(res, 'res++++');
    //           },
    //           complete() {
    //             console.log(2);
    //             // handlePrepay();
    //           },
    //         });
    //       }
    //     } else {
    //       openSetting({
    //         withSubscriptions: true,
    //       });
    //     }
    //   },
    // });
  }, 300);

  //发起预支付
  const handlePrepay = () => {
    setPayDisabled(true);
    prepay({
      bookId: order.id,
    }).then((res) => {
      if (res.code === 200) {
        console.log(res);
        const { prepay_id } = res.data;
        //发起支付
        pay({
          prepayId: prepay_id,
        }).then((res) => {
          if (res.code === 200) {
            const {
              timeStamp,
              nonceStr,
              signType,
              package: _pkg,
              paySign,
            } = res.data;
            requestPayment({
              timeStamp,
              nonceStr,
              package: _pkg,
              signType,
              paySign,
              success: function () {
                removeStorageSync('bookInfo');
                reLaunch({
                  url: '/pages/createBook/payResult/index?id=' + order.id,
                });
              },
              fail: function (error) {
                console.log(error);
                showToast({
                  title: '支付失败,请重新支付!',
                  icon: 'none',
                  success() {
                    setPayDisabled(false);
                  },
                });
              },
            });
            console.log(res.data, '>>>>>>>');
          }
        });
      }
    });
  };

  return (
    <View className="page-order">
      <AtList>
        <AtListItem title="基础服务" extraText={order.menu?.name || '-'} />
        <AtListItem title="联系人" extraText={<>{order.username || '-'}</>} />
        <AtListItem title="联系电话" extraText={<>{order.phone || '-'}</>} />
        <AtListItem
          title="爱宠名字"
          extraText={<>{order?.pet?.petname || '-'}</>}
        />
        <AtListItem
          title="预约时间"
          extraText={<>{formatDate(order.bookDateTime) || '-'}</>}
        />
        <AtListItem title="接收地址" extraText={getAddress(order.address)} />
        <AtListItem
          title="门牌号"
          extraText={<>{order?.address?.detail || '-'}</>}
        />

        {order?.bookGoods?.length > 0 && (
          <>
            <AtListItem title="附加服务" extraText="" />
            <View className="subInfo first-child">
              {order.bookGoods?.map((item) => {
                return <View className="sub-item">{item.bookGood.title}</View>;
              })}
            </View>
          </>
        )}

        <AtListItem title="备注" extraText={order.mark} />
        {/* <View className="subInfo">
          <View className="sub-item">1</View>
          <View className="sub-item">2</View>
        </View> */}
        <View className="footer">
          <CheckboxGroup onChange={handleChange}>
            <Label className="checkboxLabel">
              <Checkbox className="checkbox" value="1" color="#004ebf" />
              <Text className="txt">商品支付协议</Text>
            </Label>
          </CheckboxGroup>
          {/*      <View className="right">
            <View>基础套餐A:￥399.00</View>
            <View>超重费用:￥100.00</View>
          </View> */}
        </View>
      </AtList>

      <View className="payTools">
        <View className="payPrice">
          总金额:
          <Text className="price">¥{formatPrice(order.totalAmount)}</Text>
        </View>
        <AtButton
          disabled={payDisabled}
          circle
          className="payBtn"
          onClick={handlePay}
        >
          去支付
        </AtButton>
      </View>
    </View>
  );
};
