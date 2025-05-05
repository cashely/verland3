import Taro, { showToast } from '@tarojs/taro';
import { Component, useEffect, useState } from 'react';
import { View, Swiper, SwiperItem, Text } from '@tarojs/components';
import moment from 'moment';
import 'moment/locale/zh-cn';
import dayjs from 'dayjs';
import { WeekSwiperProps, WeekSwiperState } from './interface';
import './index.scss';

const WEEK_DAY = ['日', '一', '二', '三', '四', '五', '六'];
const timesRange = [
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
];
export class WeekSwiper extends Component<WeekSwiperProps, WeekSwiperState> {
  constructor(props: WeekSwiperProps) {
    super(props);
    this.state = {
      selectedDate: this.props.date,
      dates: [],
      swiperIdx: 1,
    };
  }
  static options = {
    addGlobalClass: true,
  };
  static defaultProps: WeekSwiperProps = {
    backgroundColor: '#6190e8',
    color: '#fff',
    date: moment().format('YYYY-MM-DD'),
  };

  componentWillMount() {
    const { selectedDate } = this.state;
    this.dayChange(selectedDate);
  }

  dayChange(date) {
    const { onChange } = this.props;
    let momentObj = moment(date);
    const selectedDay = momentObj.weekday();
    momentObj.subtract(selectedDay, 'days');
    const curStartDate = momentObj.format('YYYY-MM-DD');
    let dates = [momentObj.subtract(7, 'days').format('YYYY-MM-DD')];
    for (let i = 0; i < 20; i++) {
      dates[dates.length] = momentObj.add(1, 'days').format('YYYY-MM-DD');
    }
    this.setState({ dates, swiperIdx: 1, curStartDate });
    if (!!onChange) {
      onChange(date);
    }
  }

  onSwiperChange(e) {
    let { swiperIdx, curStartDate, dates, selectedDate } = this.state;
    const { onChange } = this.props;
    const oIndex = e.detail.current;
    let ind = oIndex - swiperIdx;
    let curDate = moment(curStartDate);
    const weekDay = moment(selectedDate).weekday();
    let updated = false;
    //向左滑动
    if (ind === 1 || ind === -2) {
      const dateArr = [] as string[];
      curDate.add(13, 'days');
      const j = oIndex + 1 === 3 ? 0 : (oIndex + 1) * 7;
      for (let i = 0; i < 7; i++) {
        dateArr[dateArr.length] = curDate.add(1, 'days').format('YYYY-MM-DD');
      }
      dates.splice(j, 7, ...dateArr);
      selectedDate = dates[oIndex * 7 + weekDay];
      this.setState({
        dates,
        swiperIdx: oIndex,
        curStartDate: moment(curStartDate).add(7, 'days').format('YYYY-MM-DD'),
        selectedDate,
      });
      updated = true;
    }
    //向右滑动
    if (ind === -1 || ind === 2) {
      const dateArr = [] as string[];
      curDate.subtract(15, 'days');
      for (let i = 0; i < 7; i++) {
        dateArr[dateArr.length] = curDate.add(1, 'days').format('YYYY-MM-DD');
      }
      dates.splice((oIndex - 1 === -1 ? 2 : oIndex - 1) * 7, 7, ...dateArr);
      selectedDate = dates[oIndex * 7 + weekDay];
      this.setState({
        dates,
        swiperIdx: oIndex,
        curStartDate: moment(curStartDate)
          .subtract(7, 'days')
          .format('YYYY-MM-DD'),
        selectedDate,
      });
      updated = true;
    }
    if (!updated) {
      selectedDate = dates[oIndex * 7 + weekDay];
      this.setState({ selectedDate });
    }
    if (!!onChange) {
      onChange(selectedDate);
    }
  }

  clickDay = (day) => {
    // Taro.showToast({
    //   icon: 'none',
    //   title: day,
    // });
    const { onChange } = this.props;
    this.setState({ selectedDate: day });
    if (!!onChange) {
      onChange(day);
    }
  };

  render() {
    const { backgroundColor, color } = this.props;
    const { dates, swiperIdx, selectedDate } = this.state;
    const format = (val) => {
      if (val === selectedDate) {
        const diff = moment().startOf('day').diff(selectedDate, 'days');
        let ret = '';
        switch (diff) {
          case 0:
            ret = '今';
            break;
          case 1:
            ret = '昨';
            break;
          case -1:
            ret = '明';
            break;
          default:
            ret = moment(val).format('M/D');
            break;
        }
        return ret;
      } else {
        return moment(val).format('DD');
      }
    };
    return (
      <View
        className="WeekSwiper-wrap"
        style={{ backgroundColor: backgroundColor, color: color }}
      >
        <View className="WeekSwiper-row">
          {Array.from(Array(7).keys()).map((i) => {
            return <View key={i}>{WEEK_DAY[i]}</View>;
          })}
        </View>
        <Swiper
          className="WeekSwiper-swiper"
          onChange={this.onSwiperChange.bind(this)}
          current={swiperIdx}
          circular
        >
          <SwiperItem>
            <View className="WeekSwiper-row WeekSwiper-day">
              {dates.slice(0, 7).map((val) => (
                <View
                  key={val}
                  onClick={this.clickDay.bind(this, val)}
                  className={
                    val === selectedDate ? 'WeekSwiper-day-selected' : ''
                  }
                  style={
                    val === selectedDate
                      ? { backgroundColor: color, color: backgroundColor }
                      : undefined
                  }
                >
                  {format(val)}
                </View>
              ))}
            </View>
          </SwiperItem>
          <SwiperItem>
            <View className="WeekSwiper-row">
              {dates.slice(7, 14).map((val) => (
                <View
                  key={val}
                  onClick={this.clickDay.bind(this, val)}
                  className={
                    val === selectedDate ? 'WeekSwiper-day-selected' : ''
                  }
                  style={
                    val === selectedDate
                      ? { backgroundColor: color, color: backgroundColor }
                      : undefined
                  }
                >
                  {format(val)}
                </View>
              ))}
            </View>
          </SwiperItem>
          <SwiperItem>
            <View className="WeekSwiper-row">
              {dates.slice(14, 21).map((val) => (
                <View
                  key={val}
                  onClick={this.clickDay.bind(this, val)}
                  className={
                    val === selectedDate ? 'WeekSwiper-day-selected' : ''
                  }
                  style={
                    val === selectedDate
                      ? { backgroundColor: color, color: backgroundColor }
                      : undefined
                  }
                >
                  {format(val)}
                </View>
              ))}
            </View>
          </SwiperItem>
        </Swiper>
      </View>
    );
  }
}

export default function WeekIndex(props) {
  const { formItem, items, invalidTimes, formData, invalidRiteTimes } = props;
  const [times, setTimes] = useState<Array<any>>([]);
  const [curSelectedDate, setCurSelectedDate] = useState<any>('');

  const isSameToday = (date) => {
    return dayjs(date).isSame(dayjs(), 'day');
  };

  const isBeforeToday = (date) => {
    return dayjs(date).isBefore(dayjs(), 'day');
  };

  const getItemKey = (item) => {
    return dayjs(curSelectedDate)
      .set('hour', item)
      .format(`YYYY-MM-DD HH:00:00`);
  };

  const invalidTime = (item) => {
    return invalidTimes.includes(getItemKey(item));
  };

  const invalidRiteTime = (item) => {
    return invalidRiteTimes.includes(getItemKey(item));
  };

  const disabledFun = (item) => {
    if (isBeforeToday(curSelectedDate)) {
      return true;
    }

    if (formItem.prop === 'bookDateTime') {
      return (
        !items.includes(String(item)) ||
        invalidTime(item) ||
        (isSameToday(curSelectedDate) && item <= dayjs().hour() + 2)
      );
    }

    //预约时间
    if (formItem.prop === 'riteDateTime') {
      return (
        !items.includes(String(item)) ||
        invalidTime(item) ||
        invalidRiteTime(item) ||
        (isSameToday(curSelectedDate) && item <= dayjs().hour() + 2) ||
        (formData.bookDateTime && getItemKey(item) <= formData.bookDateTime)
      );
    }

    if (formItem.prop === 'handleDateTime') {
      // console.log('51formdata', formData);
      return (
        !items.includes(item) ||
        invalidTime(item) ||
        (isSameToday(curSelectedDate) && item <= dayjs().hour()) ||
        (formData.riteDateTime &&
          !dayjs(getItemKey(item)).isAfter(
            dayjs(formData.riteDateTime).add(1, 'day')
          )) ||
        (formData.bookDateTime &&
          !dayjs(getItemKey(item)).isAfter(dayjs(formData.bookDateTime)))
      );
    }

    return false;
  };

  const selectedFun = (item: any) => {
    if (formItem.prop === 'bookDateTime') {
      return getItemKey(item) === formData.bookDateTime;
    }
    if (formItem.prop === 'riteDateTime') {
      return getItemKey(item) === formData.riteDateTime;
    }
    if (formItem.prop === 'handleDateTime') {
      return getItemKey(item) === formData.handleDateTime;
    }
  };
  useEffect(() => {
    // console.log('51', invalidTimes, props);
    setTimes(
      timesRange.map((item: any) => {
        return {
          key: dayjs(curSelectedDate)
            .set('hour', item)
            .format(`YYYY-MM-DD HH:00:00`),
          label: item,
          disabled: disabledFun(item),
          selected: selectedFun(item),
        };
      })
    );
  }, [
    props.items.length,
    curSelectedDate,
    formData.bookDateTime,
    formData.riteDateTime,
    formData.handleDateTime,
  ]);

  const handleSelectedDate = (date: Date) => {
    setCurSelectedDate(date);
  };

  const handleSelectItem = (item: any, index: number) => {
    if (item.disabled) return;
    times.forEach((val) => {
      val.selected = false;
    });
    times[index].selected = !times[index].selected;
    setTimes([...times]);
  };

  const handleConfirm = () => {
    const selectedTime = times.find((item) => item.selected);
    if (!selectedTime?.key)
      return showToast({
        title: '请选择时间',
        icon: 'none',
      });
    props.onChange(selectedTime.key);
  };

  return (
    <View className="index">
      {/* {JSON.stringify(dayjs().hour())} */}
      <View className="title1">{props.formItem.label ?? '选择日期'}</View>
      <WeekSwiper onChange={handleSelectedDate} />
      <View className="times-content">
        {times?.map((item: any, index: number) => {
          return (
            <View
              className={`item  ${item.selected ? 'selected' : ''} ${
                item?.disabled ? 'disabled' : ''
              }`}
              onClick={() => handleSelectItem(item, index)}
            >
              <View className="time">{item.label}:00</View>
              <View className="text">
                {invalidTimes.includes(item.key) ||
                invalidRiteTimes.includes(item.key) ? (
                  '已满'
                ) : item?.disabled ? (
                  '不可预约'
                ) : (
                  <Text className="canAppoint">可预约</Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
      <View className="submitBtn" onClick={handleConfirm}>
        确认
      </View>
    </View>
  );
}
