import { View, Text, Image } from '@tarojs/components';
import { getStorageSync, showToast, redirectTo } from '@tarojs/taro';
import { AtButton, AtActionSheet } from 'taro-ui';
import { Suspense, useEffect, useState } from 'react';
import { list } from '@/apis/bookGood';
import { add } from '@/apis/book';
import { fileUrl } from '@/apis';
import { formatPrice } from '@/utils';
import './index.scss';

interface IDataItem {
  id: string;
  title: string;
  content: string;
  price: number;
}

export default function AdditionalService() {
  //附加服务的价格加上基本服务的价格
  const [totalAmount, setToalAmount] = useState(0); //1分钱
  const [selectedIndex, setSelectedIndex] = useState<number[]>([]);
  const [isOpened, setIsOpened] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IDataItem>();
  const [data, setData] = useState<IDataItem[]>([]);

  // 已选中的附加服务的价格
  useEffect(() => {
    // const bookInfo = JSON.parse(getStorageSync('bookInfo') || '{}');
    // setToalAmount(bookInfo?.totalAmount);

    const totalPrice = data?.reduce((acc, item, index) => {
      if (selectedIndex.includes(index)) {
        return acc + item.price;
      }
      return acc;
    }, totalAmount);
    setToalAmount(totalPrice);
  }, [selectedIndex]);

  const createAppointBill = () => {
    const bookInfo = getStorageSync('bookInfo') || {};
    console.log('bookInfo', bookInfo);
    add({
      ...bookInfo,
      bookGoodIds: data
        .filter((_, index) => selectedIndex.includes(index))
        .map((item) => item.id),
      totalAmount,
    }).then((res) => {
      console.log('res', res);
      if (res.code === 200) {
        const { data } = res;
        showToast({
          title: '预约单创建成功',
          icon: 'none',
          success() {
            setTimeout(() => {
              redirectTo({
                url: '../order/index?id=' + data.id,
              });
            }, 1000);
          },
        });
      }
    });
  };

  const handleSelectItem = (index: number) => {
    if (selectedIndex.indexOf(index) > -1) {
      selectedIndex.splice(selectedIndex.indexOf(index), 1);
    } else {
      selectedIndex.push(index);
    }
    setSelectedIndex([...selectedIndex]);
    console.log(index, selectedIndex);
  };
  const handleNextStep = () => {
    console.log('next step');
    //需要传递附加服务
    createAppointBill();
  };

  const getData = async () => {
    await list().then((res) => {
      const { data = [] } = res;
      console.log('data', data);
      setData(
        data.map((item) => ({
          ...item,
          imageUrl: item?.thumb?.path?.replace('\\', '/'),
        }))
      );
    });
  };

  const handleClose = () => {
    setIsOpened(false);
  };

  const handleShowDetail = (e, id: string) => {
    //阻止冒泡
    e.stopPropagation();
    setIsOpened(true);
    setSelectedItem(data?.find((item) => item.id === id));
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Suspense fallback={<Text>加载中...</Text>}>
      <View className="page-additionalService">
        <View className="content">
          <View className="inner">
            {data?.length ? (
              data.map((item, index) => (
                <View
                  className={`as-item ${
                    selectedIndex.includes(index) ? 'selected' : ''
                  }`}
                  key={index}
                  onClick={() => handleSelectItem(index)}
                >
                  <View className="as-item__image">
                    <Image
                      className="image"
                      mode="widthFix"
                      style={{ width: '80px', height: '80px' }}
                      src={fileUrl + '/' + item.imageUrl}
                    ></Image>
                  </View>
                  <View className="as-item__content">
                    <View className="as-item__content-name">{item.title}</View>
                    <View>
                      <View
                        onClick={(e) => handleShowDetail(e, item.id)}
                        className="goDetail"
                      >
                        查看详情
                      </View>

                      <View className="as-item__content-price">
                        ¥{formatPrice(item.price)}
                      </View>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <View>暂无附加服务数据</View>
            )}
          </View>
        </View>

        <View className="flex gap-4 mt-40 footer">
          <AtButton
            type="secondary"
            className="flex-1 btn"
            onClick={handleNextStep}
          >
            跳过
          </AtButton>
          <AtButton
            type="primary"
            className="flex-1 btn"
            onClick={handleNextStep}
          >
            下一步
          </AtButton>
        </View>
      </View>

      <AtActionSheet
        isOpened={isOpened}
        onCancel={handleClose}
        onClose={handleClose}
        title={selectedItem?.title}
      >
        <View className="book-content">
          {selectedItem?.content || '暂无内容'}
        </View>
      </AtActionSheet>
    </Suspense>
  );
}
