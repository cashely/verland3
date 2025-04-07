import { useEffect, useState } from 'react';
import { View, PickerView, PickerViewColumn } from '@tarojs/components';
import { AtActionSheet } from 'taro-ui';
import { showToast } from '@tarojs/taro';
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
  console.log(props.data, 'fsafasfsa');
  for (let i = 1; i <= 12; i++) {
    if (i >= Math.max(date.getMonth() + 1, props.data.minDate.month)) {
      months.push(i);
    }
  }
  for (let i = 1; i <= 31; i++) {
    if (i >= Math.max(date.getDate(), props.data.minDate.day)) {
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
  // const timeRange = ['10:00', '12:00', '14:00', '16:00'];

  const [data, setData] = useState({
    month: 2,
    day: 2,
    value: [0, 0, 0, 0],
  });

  const [availableRanges, setAvailableRanges] = useState<string[]>([]);

  useEffect(() => {
    console.log('打开日期组件弹框', data);
    // countData(data.value, () => {});
    setData({
      ...data,
      value: [0, 0, 0, 0],
    });
  }, [props.isOpened]);

  // 筛选未过期的时间段
  const filterAvailableRanges = (times: string[]) => {
    return times.filter((slot) => {
      // 将时间段转换为今天的日期时间对象
      const slotTime = dayjs()
        .set('hour', parseInt(slot.split(':')[0]))
        .set('minute', parseInt(slot.split(':')[1] || '0'));

      // 比较时间段是否在当前时间之后
      return slotTime.isAfter(dayjs());
    });
  };

  useEffect(() => {
    const timeRanges = props.data.timeRange;
    if (props.data.supportAll) {
      console.log('支持全部', timeRanges);
      setAvailableRanges(timeRanges);
    } else {
      setAvailableRanges(filterAvailableRanges(timeRanges));
    }
  }, [props.data.timeRange.length]);

  const countData = (val, callback) => {
    setData((_data) => {
      _data.month = months[val[1]];
      _data.day = days[val[2]];
      _data.value = val;
      callback && callback(_data);
      return _data;
    });
  };

  const onChange = (e) => {
    console.log(e, '+++++');
    if (!props.data.supportAll) {
      const dayIndex = e.detail.value[2];
      const monthIndex = e.detail.value[1];
      console.log(dayjs().format('M'), '+++++');
      if (
        months[monthIndex] > +dayjs().format('M') ||
        days[dayIndex] > +dayjs().format('D')
      ) {
        console.log(dayjs().format('D'), '+++++');
        setAvailableRanges(props.data.timeRange);
      } else {
        setAvailableRanges(filterAvailableRanges(props.data.timeRange));
      }
    }
    const val = e.detail.value;
    countData(val, (value) => {
      props?.onDatePickerColumn &&
        props.onDatePickerColumn({
          propName: props.data.formProp,
          value,
          setAvailableRanges,
          selectedTime: `${year}-${padZero(data.month)}-${padZero(data.day)}`,
        });
    });
  };

  const closeSheet = () => {
    props?.onClose?.();
  };

  const handleCancel = () => {
    closeSheet();
  };

  //月份和日前面补0
  const padZero = (num: number) => {
    return num.toString().padStart(2, '0');
  };

  const handleConfirm = () => {
    const curTime = availableRanges[data.value[3]];
    if (!curTime) {
      return showToast({
        title: '请选择具体时间段',
        icon: 'none',
      });
    }
    console.log(data, props.data, '----46---');
    setData((d) => {
      props?.onConfirm?.({
        formProp: props.data.formProp,
        value: `${year}-${padZero(data.month)}-${padZero(data.day)} ${
          availableRanges[data.value[3]]
        }`,
      });
      // d.value = [0, 0, 0, 0];
      return d;
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
        <View className="flex items-center justify-between sheetHeader">
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
            {availableRanges.map((item) => {
              return <View className="column-item">{item}</View>;
            })}
          </PickerViewColumn>
        </PickerView>
      </View>
    </AtActionSheet>
  );
};
