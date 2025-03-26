import { Checkbox, View, CheckboxGroup, Label, Text } from '@tarojs/components';
import { useState } from 'react';
import { AtList, AtListItem, AtButton } from 'taro-ui';
import {
  redirectTo,
  useLoad,
  removeStorageSync,
  showToast,
  requestPayment,
  requestSubscribeMessage,
  getSetting,
} from '@tarojs/taro';
import { detail, prepay, pay } from '@/apis/book';
import { BASE_SERVICES } from '@/constants';
import { formatPrice } from '@/utils';
import dayjs from 'dayjs';
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
    bookDateTime: '',
    menuDesc: '',
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
            menuDesc: BASE_SERVICES?.find(
              (item) => item.value === res.data.menu
            )?.label, //服务名称
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
  const handleTest = () => {
    console.log('test');

    getSetting({
      withSubscriptions: true,
      success: function (res) {
        if (
          res.subscriptionsSetting.mainSwitch &&
          res.subscriptionsSetting.mainSwitch != null
        ) {
          if (res.subscriptionsSetting.itemSettings) {
            let moIdState =
              res.subscriptionsSetting.itemSettings[
                'XKQpCEj93wAHPxWaQoET5UwYHkHHnCDP_K4YtOeRpkY'
              ];
            if (moIdState === 'accept') {
              console.log('同意消息推送');
            } else if (moIdState === 'reject') {
              console.log('拒绝消息推送');
            } else if (moIdState === 'ban') {
              console.log('已被后台封禁');
            }
          }
        } else {
          if (requestSubscribeMessage) {
            requestSubscribeMessage({
              tmplIds: [
                'XKQpCEj93wAHPxWaQoET5UwYHkHHnCDP_K4YtOeRpkY',
                'fIijh96IYidJFYVTWwW2FsvEu2b7yKaQ7MO9FDv8M7U',
              ],
              entityIds: [
                'XKQpCEj93wAHPxWaQoET5UwYHkHHnCDP_K4YtOeRpkY',
                'fIijh96IYidJFYVTWwW2FsvEu2b7yKaQ7MO9FDv8M7U',
              ],
              success(res) {
                console.log('同意消息推送');
              },
              fail(res) {
                console.log('requestSubscribeMessage fail', res);
              },
            });
          }
        }
      },
      fail: function (error) {
        console.log(error);
      },
    });
  };
  const handlePay = () => {
    if (!agreement) {
      return showToast({
        title: '请勾选商品支付协议',
        icon: 'none',
      });
    }
    //发起预支付
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
            console.log(res.data, '>>>>>>>');

            //弹窗授权窗口
            requestSubscribeMessage({
              tmplIds: [
                'XKQpCEj93wAHPxWaQoET5UwYHkHHnCDP_K4YtOeRpkY',
                'fIijh96IYidJFYVTWwW2FsvEu2b7yKaQ7MO9FDv8M7U',
              ],
              entityIds: [
                'XKQpCEj93wAHPxWaQoET5UwYHkHHnCDP_K4YtOeRpkY',
                'fIijh96IYidJFYVTWwW2FsvEu2b7yKaQ7MO9FDv8M7U',
              ],
              success: function (res) {
                console.log(res, '订阅成功');
                requestPayment({
                  timeStamp,
                  nonceStr,
                  package: _pkg,
                  signType,
                  paySign,
                  success: function () {
                    removeStorageSync('bookInfo');
                    setPayDisabled(true);
                    redirectTo({
                      url: '/pages/createBook/payResult/index?id=' + order.id,
                    });
                  },
                  fail: function (error) {
                    console.log(error);
                    showToast({
                      title: '支付失败',
                      icon: 'none',
                    });
                  },
                });
              },
              fail: function (err) {
                console.log(err, '订阅消息失败');
              },
            });
          }
        });
      }
    });
  };

  return (
    <View className="page-order">
      <View type="primary" onClick={handleTest}></View>
      <AtList>
        <AtListItem title="基础服务" extraText={<>{order.menuDesc || '-'}</>} />
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
