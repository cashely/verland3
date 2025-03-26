import { useEffect, useState } from 'react';
import { View, PickerView, PickerViewColumn } from '@tarojs/components';
import { AtButton, AtActionSheet } from 'taro-ui';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
import './index.scss';
export default (props) => {
  const date = new Date();
  const year = date.getFullYear();
  const months: Array<number> = [];
  const days: Array<number> = [];

  for (let i = 1; i <= 12; i++) {
    if (i >= date.getMonth() + 1) {
      months.push(i);
    }
  }
  for (let i = 1; i <= 31; i++) {
    if (i >= date.getDate()) {
      days.push(i);
    }
  }

  /**
   * 判断当前时间是否在指定时间段内
   * @param {string} startTime 开始时间（格式: HH:mm）
   * @param {string} endTime 结束时间（格式: HH:mm）
   * @returns {boolean}
   */
  function isTimeBetween(time) {
    // 获取当前时间（无日期信息）
    const current = dayjs(dayjs().format('HH:mm'), 'HH:mm'); //转为dayjs对象
    const [startTime, endTime] = time.split('-');
    // 解析开始时间和结束时间
    const start = dayjs(startTime, 'HH:mm');
    const end = dayjs(endTime, 'HH:mm');

    // 处理跨天时间段（如 22:00 - 02:00）
    if (end.isBefore(start)) {
      return current.isSameOrAfter(start) || current.isSameOrBefore(end);
    }

    // 正常时间段判断
    return current.isSameOrAfter(start) && current.isSameOrBefore(end);
  }

  //2小时间隔
  const timeRanges = ['10:00', '12:00', '14:00', '16:00'];

  const [data, setData] = useState({
    month: 2,
    day: 2,
    value: [0, 0, 0, 0],
  });

  useEffect(() => {
    countData(data.value);
    console.log(timeRanges.filter((item) => isTimeBetween(item)));
  }, []);

  const countData = (val) => {
    setData((_data) => {
      _data.month = months[val[1]];
      _data.day = days[val[2]];
      _data.value = val;
      return _data;
    });
  };

  const onChange = (e) => {
    const val = e.detail.value;
    countData(val);
  };

  const closeSheet = () => {
    props?.onClose?.();
  };

  const handleCancel = () => {
    closeSheet();
  };

  const handleConfirm = () => {
    console.log(data, props.data.formProp, '--------');
    props?.onConfirm?.({
      formProp: props.data.formProp,
      value: `${year}-${data.month}-${data.day} ${timeRanges[data.value[3]]}`,
    });
    closeSheet();
  };

  return (
    <AtActionSheet
      isOpened={props.isOpened}
      onCancel={closeSheet}
      onClose={closeSheet}
    >
      <View className="datetimePicker">
        <View className="sheetHeader flex items-center justify-between">
          {/* {year}年{data.month}月{data.day}日 */}
          <View onClick={handleCancel}>取消</View>
          <View className="title">请选择时间</View>
          <View onClick={handleConfirm} className="confirm-btn">
            确认
          </View>
        </View>
        <PickerView
          indicatorStyle="height: 40px;"
          style="width: 100%; height: 260px;"
          value={data.value}
          onChange={onChange}
        >
          <PickerViewColumn>
            <View className="column-item">{year}年</View>
          </PickerViewColumn>
          <PickerViewColumn>
            {months.map((item) => {
              return <View className="column-item">{item}月</View>;
            })}
          </PickerViewColumn>
          <PickerViewColumn>
            {days.map((item) => {
              return <View className="column-item">{item}日</View>;
            })}
          </PickerViewColumn>
          <PickerViewColumn>
            {timeRanges.map((item) => {
              return <View className="column-item">{item}</View>;
            })}
          </PickerViewColumn>
        </PickerView>
      </View>
    </AtActionSheet>
  );
};
