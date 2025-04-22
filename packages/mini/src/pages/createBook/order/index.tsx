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
} from '@tarojs/taro';
import { detail, prepay, pay } from '@/apis/book';
import { formatPrice } from '@/utils';
import dayjs from 'dayjs';
import { debounce } from 'lodash-es';
import { PAY_TMP, HANDLE_WAYS, PET_RECEIVE_WAYS } from '@/constants';
import ServiceContent from '@/components/ServiceContent';
import './index.scss';

export default () => {
  const [order, setOrder] = useState({
    id: '',
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
    totalAmount: 0,
  });
  const [agreeCheck, setAgreeCheck] = useState(false);
  const [agreeCheck2, setAgreeCheck2] = useState(false);
  const [payDisabled, setPayDisabled] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [isOpened2, setIsOpened2] = useState(false);
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
    if (!date) return null;
    return dayjs(date).format('YYYY-MM-DD HH:mm');
  };

  const getAddress = (address) => {
    if (!address?.id) return '-';
    return `${address.province}${address.city}${address.area || '-'}`;
  };

  const handlePay = debounce(() => {
    if (!agreeCheck) {
      return showToast({
        title: '请勾选用户服务协议',
        icon: 'none',
      });
    } else if (!agreeCheck2) {
      return showToast({
        title: '请勾选商品支付协议',
        icon: 'none',
      });
    }
    // requestSubscribeMessage({
    //   tmplIds: [REFUND_TMP],
    //   entityIds: [],
    //   complete() {},
    // });
    handlePrepay();

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
    //           tmplIds: [tmpId, refundTmpId],
    //           entityIds: [tmpId, refundTmpId],
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
      bookId: order.id as string,
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
                //付款通知消息订阅
                showToast({
                  title: '支付成功!',
                  icon: 'none',
                  success() {
                    //弹出订阅消息
                    requestSubscribeMessage({
                      tmplIds: [PAY_TMP],
                      entityIds: [],
                      complete() {
                        console.log(2);
                        removeStorageSync('bookInfo');
                        reLaunch({
                          url:
                            '/pages/createBook/payResult/index?id=' + order.id,
                        });
                      },
                    });
                  },
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

  const handleAgreementChange = (e, type: string) => {
    const res = e.detail.value;

    if (type === 'service') {
      setAgreeCheck(res?.length);
    } else if (type === 'pay') {
      setAgreeCheck2(res?.length);
    }
  };

  const handleSure = () => {
    setAgreeCheck(true);
    setIsOpened(false);
  };
  const handleSure2 = () => {
    setAgreeCheck2(true);
    setIsOpened2(false);
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
        {formatDate(order.bookDateTime) ? (
          <AtListItem
            title="上门服务时间"
            extraText={<>{formatDate(order.bookDateTime) || '-'}</>}
          />
        ) : null}

        {
          <AtListItem
            title="是否需要仪式"
            extraText={order?.isRite == 1 ? '是' : '否'}
          />
        }

        {order?.riteDateTime ? (
          <AtListItem
            title="仪式预约时间"
            extraText={
              order?.isRite == 1 ? formatDate(order.riteDateTime) : '-'
            }
          />
        ) : null}

        {order?.handleWay && order?.handleWay != 1 ? (
          <AtListItem
            title="纪念物获取方式"
            extraText={
              HANDLE_WAYS.find((n) => n.value == order.handleWay)?.label || '-'
            }
          />
        ) : null}

        {order?.handleDateTime ? (
          <AtListItem
            title="纪念物获取时间"
            extraText={formatDate(order?.handleDateTime) || '-'}
          />
        ) : null}

        {
          <AtListItem
            title="宠物接收方式"
            extraText={
              <>
                {PET_RECEIVE_WAYS.find((n) => n.value == order.expressWay)
                  ?.label || '-'}
              </>
            }
          />
        }

        {order?.expressWay == 2 ? (
          <AtListItem
            title="宠物门店"
            extraText={
              order?.petStore?.name
                ? `${order?.petStore?.name}-${order?.petStore?.address}`
                : '-'
            }
          />
        ) : null}

        {order?.address && order?.expressWay == 3 ? (
          <>
            {/* <AtListItem
              title="上门收取时间"
              extraText={formatDate(order.expressDateTime || '-')}
            /> */}
            <AtListItem
              title="接收地址"
              extraText={getAddress(order.address)}
            />
            <AtListItem
              title="门牌号"
              extraText={<>{order?.address?.detail || '-'}</>}
            />
          </>
        ) : null}

        {order?.bookGoods?.length > 0 && (
          <>
            <AtListItem title="附加服务" extraText="" />
            <View className="subInfo first-child">
              {order.bookGoods?.map((item: any) => {
                return <View className="sub-item">{item.bookGood.title}</View>;
              })}
            </View>
          </>
        )}

        <AtListItem title="备注" extraText={order.mark || '暂无'} />
        {/* <View className="subInfo">
          <View className="sub-item">1</View>
          <View className="sub-item">2</View>
        </View> */}
        <View className="footer">
          {/* 协议 */}
          <View className="flex items-center mb-20">
            <CheckboxGroup
              onChange={(e) => handleAgreementChange(e, 'service')}
            >
              <Label className="checkboxLabel">
                <Checkbox
                  className="checkbox"
                  value="agree"
                  color="#004ebf"
                  checked={agreeCheck}
                />
              </Label>
            </CheckboxGroup>

            <Text className="txt" onClick={() => setIsOpened(true)}>
              用户服务协议
            </Text>
          </View>
          <View className="flex items-center">
            <CheckboxGroup onChange={(e) => handleAgreementChange(e, 'pay')}>
              <Label className="checkboxLabel">
                <Checkbox
                  className="checkbox"
                  checked={agreeCheck2}
                  value="agree"
                  color="#004ebf"
                />
              </Label>
            </CheckboxGroup>
            <Text className="txt" onClick={() => setIsOpened2(true)}>
              商品支付协议
            </Text>
          </View>
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

      <ServiceContent
        title="用户服务协议"
        type="service"
        isOpened={isOpened}
        onClose={() => setIsOpened(false)}
        onConfirm={handleSure}
      ></ServiceContent>
      <ServiceContent
        title="商品支付协议"
        isOpened={isOpened2}
        type="pay"
        onClose={() => setIsOpened2(false)}
        onConfirm={handleSure2}
      ></ServiceContent>
    </View>
  );
};
