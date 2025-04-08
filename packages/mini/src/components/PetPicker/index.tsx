import { useEffect, useState } from 'react';
import { View, PickerView, PickerViewColumn } from '@tarojs/components';
import { AtActionSheet } from 'taro-ui';
import { PET_TYPES, PET_SUBTYPES } from '@/constants';
import './index.scss';
export default (props) => {
  //2小时间隔
  // const timeRange = ['10:00', '12:00', '14:00', '16:00'];

  const [data, setData] = useState({
    type: PET_TYPES[0],
    subType: PET_SUBTYPES[0][0],
  });
  const [subTypes, setSubTypes] = useState([]);
  useEffect(() => {
    console.log('打开日期组件弹框', data);
    if (props.isShow && subTypes.length === 0) {
      setSubTypes(PET_SUBTYPES[0]);
    }
  }, [props.isShow]);

  const closeSheet = () => {
    props?.onClose?.();
  };

  const handleCancel = () => {
    closeSheet();
  };

  const handleChange = (e) => {
    console.log(e.detail.value, '----44---');
    const [firstColumnIndex] = e.detail.value;
    setSubTypes(PET_SUBTYPES[firstColumnIndex]);
    setData({
      ...data,
      type: PET_TYPES[firstColumnIndex],
      subType: PET_SUBTYPES[firstColumnIndex][0],
    });
  };
  const handleConfirm = () => {
    props?.onConfirm?.(data);
    closeSheet();
  };

  return (
    <AtActionSheet
      isOpened={props.isShow}
      onCancel={closeSheet}
      onClose={closeSheet}
    >
      <View className="datetimePicker">
        <View className="flex items-center justify-between sheetHeader">
          {/* {year}年{data.month}月{data.day}日 */}
          <View onClick={handleCancel}>取消</View>
          <View className="title">请选择宠物类型</View>
          <View onClick={handleConfirm} className="confirm-btn">
            确认
          </View>
        </View>
        <PickerView
          indicatorStyle="height: 40px;"
          style="width: 100%; height: 260px;"
          onChange={handleChange}
        >
          <PickerViewColumn>
            {PET_TYPES.map((item) => {
              return <View className="column-item">{item}</View>;
            })}
          </PickerViewColumn>

          <PickerViewColumn>
            {subTypes.map((item) => {
              return <View className="column-item">{item}</View>;
            })}
          </PickerViewColumn>
        </PickerView>
      </View>
    </AtActionSheet>
  );
};
