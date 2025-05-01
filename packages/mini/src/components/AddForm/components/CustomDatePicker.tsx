import { useState, useEffect, useRef, useCallback } from 'react';
import dayjs from 'dayjs';
import { View, Image, Text } from '@tarojs/components';
import { AtList, AtListItem } from 'taro-ui';
import { DatePicker, PickerOption } from '@nutui/nutui-react-taro';
import dateIcon from '../../../assets/imgs/date-icon.png';
import {
  SERVICE_TIME_RANGES,
  RITE_SERVICE_TIME_RANGES,
  HANDLE_TIME_RANGES,
} from '@/constants';
import { showToast } from '@tarojs/taro';
import _ from 'lodash-es';

const FILTERTIMES = {
  bookDateTime: SERVICE_TIME_RANGES,
  riteDateTime: RITE_SERVICE_TIME_RANGES,
  handleDateTime: HANDLE_TIME_RANGES,
};

function CustomDatePicker(props: any) {
  const { formItem, formData, invalidTimes = [] } = props;
  const latestRightDateRef = useRef<any>();
  const [YMD, setYMD] = useState<any>(new Date());
  const invalidTimesRef = useRef<any>([]);
  const [value, setValue] = useState(() => {
    // 获取时间的最大值
    // 获取formItem里面prop的值
    const currentHour = dayjs().hour() + 1;
    console.log(currentHour, '426currentHour');
    if (!FILTERTIMES[formItem.prop]) {
      return new Date(
        dayjs().set('hour', currentHour).format('YYYY/MM/DD HH:mm:00')
      );
    }
    let maxHour = Math.max(currentHour, FILTERTIMES[formItem.prop][0]);
    // 如果maxHour不在FILTERTIMES里面，就取FILTERTIMES的第一个值
    if (!FILTERTIMES[formItem.prop].includes(String(maxHour))) {
      maxHour = FILTERTIMES[formItem.prop][0];
    }

    console.log(formData, '===form426Data===');
    // if (formData.prop === 'bookDateTime' && !formData.bookDateTime) {
    //   return new Date(
    //     dayjs(formData.bookDateTime)
    //       .set('hour', maxHour)
    //       .format('YYYY-MM-DD HH:mm:00')
    //   );
    // }
    // if (formItem.prop === 'riteDateTime') {
    //   return formData.bookDateTime
    //     ? new Date(
    //         dayjs()
    //           .set('hour', maxHour)
    //           .set('date', dayjs(formData.bookDateTime).date() + 1)
    //           .format('YYYY-MM-DD HH:mm:00')
    //       )
    //     : new Date(
    //         dayjs()
    //           .set('hour', maxHour)
    //           .set('date', dayjs().date() + 1)
    //           .format('YYYY-MM-DD HH:mm:00')
    //       );
    // } else if (formItem.prop === 'handleDateTime') {
    //   return formData.riteDateTime
    //     ? new Date(
    //         dayjs()
    //           .set('hour', maxHour)
    //           .set('date', dayjs(formData.riteDateTime).date() + 1)
    //           .format('YYYY-MM-DD HH:mm:00')
    //       )
    //     : new Date(
    //         dayjs()
    //           .set('hour', maxHour)
    //           .set('date', dayjs().date() + 2)
    //           .format('YYYY-MM-DD HH:mm:00')
    //       );
    // }
    let rightNow = dayjs().set('hour', maxHour).format('YYYY-MM-DD HH:mm:00');
    console.log('426', rightNow);
    return new Date(rightNow);
  });

  const [visible, setVisible] = useState(false);

  // 选择时间点击
  const handleListClick = (formItem: any) => {
    const filterTimes = FILTERTIMES[formItem.prop];
    const getlastHour = filterTimes[filterTimes.length - 1];
    if (formItem.prop === 'bookDateTime' || formItem.prop === 'riteDateTime') {
      const filterTimes = FILTERTIMES[formItem.prop].filter(
        (n) => n > dayjs().add(2, 'hour').get('hour')
      );
      let setHour = filterTimes.filter(
        (n) => n != dayjs(formData.bookDateTime).get('hour')
      )[0];
      console.log('438', filterTimes, setHour);
      if (filterTimes.length > 0) {
        // if (formData.bookDateTime) {
        //   setValue(
        //     new Date(
        //       dayjs(formData.bookDateTime)
        //         .set('hour', setHour)
        //         .format('YYYY-MM-DD HH:mm:00')
        //     )
        //   );
        // setYMD(
        //   new Date(
        //     dayjs(formData.bookDateTime)
        //       .set('hour', setHour)
        //       .format('YYYY-MM-DD HH:mm:00')
        //   )
        // );
        // } else {
        setValue(
          new Date(
            dayjs().set('hour', filterTimes[0]).format('YYYY-MM-DD HH:mm:00')
          )
        );
        // setYMD(
        //   new Date(dayjs().set('hour', setHour).format('YYYY-MM-DD HH:mm:00'))
        // );
        // }
      } else {
        setValue(
          new Date(
            dayjs().set('hour', getlastHour).format('YYYY-MM-DD HH:mm:00')
          )
        );
        // setYMD(
        //   new Date(
        //     dayjs().set('hour', getlastHour).format('YYYY-MM-DD HH:mm:00')
        //   )
        // );
      }
      // let getHour = dayjs().add(2, 'hour');
      // if (filterTimes.includes(getHour.hour())) {
      //   setValue(
      //     new Date(dayjs().add(2, 'hour').format('YYYY-MM-DD HH:mm:00'))
      //   );
      // }
    } else {
      if (formData.riteDateTime && !formData.handleDateTime) {
        const hour = dayjs(formData.riteDateTime).add(24, 'hour').get('hour');
        const minHours = filterTimes.filter((n) => n > dayjs().hour());
        console.log('449', hour);
        if (filterTimes.includes(String(hour))) {
          setValue(
            new Date(
              dayjs(formData.riteDateTime)
                .add(24, 'hour')
                .set(
                  'hour',
                  minHours.includes(hour)
                    ? hour
                    : minHours[minHours.length - 1] || 10
                )
                .format('YYYY-MM-DD HH:mm:00')
            )
          );
          // setYMD(
          //   new Date(
          //     dayjs(formData.riteDateTime)
          //       .add(24, 'hour')
          //       .set(
          //         'hour',
          //         minHours.includes(hour)
          //           ? hour
          //           : minHours[minHours.length - 1] || 10
          //       )
          //       .format('YYYY-MM-DD HH:mm:00')
          //   )
          // );
        }
      } else {
        setValue(
          new Date(
            dayjs().set('hour', getlastHour).format('YYYY-MM-DD HH:mm:00')
          )
        );
        // setYMD(
        //   new Date(
        //     dayjs().set('hour', getlastHour).format('YYYY-MM-DD HH:mm:00')
        //   )
        // );
      }
    }
    setVisible(true);
    //默认小时设置为没有被预约的枚举销售第一个
    // const getInvalidTimes = props.invalidTimes
    //   .filter((item: any) => item.includes(dayjs().format('YYYY/MM/DD')))
    //   .map((n) => n.split(' ')[1].split(':')[0]);

    // if (formItem.prop === 'bookDateTime') {
    //   onChange([
    //     { label: '', value: dayjs().year(), isShow: true },
    //     { label: '', value: dayjs().month() + 1, disabled: false },
    //     { label: '', value: dayjs().date(), isShow: false },
    //     {
    //       label: '',
    //       value: _.xor(FILTERTIMES[formItem.prop], getInvalidTimes)[0],
    //       isShow: false,
    //     },
    //   ]);
    // }
  };

  // 取消
  const onCancel = () => {
    setVisible(false);
  };

  // 确定
  const onConfirm = async (latestValue: any, currentValue) => {
    // 判断latestRightDateRef.current的时间跟value是否一致，如果不一致，就不允许选择
    if (latestValue.length < 4) {
      showToast({
        title: '选择的时间格式错误',
        icon: 'none',
        duration: 2000,
      });
      // console.error('选择的时间格式错误');
    } else {
      const [
        { value: year },
        { value: month },
        { value: day },
        { value: hour },
      ] = latestValue;
      // const curdate = dayjs(
      //   `${currentValue[0]}-${currentValue[1]}-${currentValue[2]} ${currentValue[3]}`
      // );

      // if (
      //   !!formData.riteDateTime &&
      //   formItem.prop === 'handleDateTime' &&
      //   formData.riteDateTime == formData.handleDateTime
      // ) {
      //   showToast({
      //     title: '预约仪式时间不能与纪念物获取时间相同',
      //     icon: 'none',
      //   });
      //   return onCancel();
      // }

      //修改外部的值
      const selectedValue = `${year}-${month}-${day} ${hour}:00`;
      props.onChange(selectedValue, formItem);
    }
    onCancel();
  };

  // 选择时间
  const onChange = (afterValue: any) => {
    // 修改内部的值
    console.log('选择之前的时间', value);
    console.log('选择的时间value', afterValue);
    const [{ value: year1 }, { value: month1 }, { value: day1 }] = afterValue;
    setYMD(`${year1}-${month1}-${day1}`);
    if (afterValue.length < 4) {
      // showToast({
      //   title: '选择的时间格式错误1',
      //   icon: 'none',
      //   duration: 2000,
      // });
      // console.error('选择的时间格式错误');
      return false;
    }
    const [{ value: year }, { value: month }, { value: day }, { value: hour }] =
      afterValue;

    const selectedValue = `${year}/${month}/${day} ${hour}:00:00`;
    console.log(selectedValue, '最后格式化赋值的时间');
    // 如果选择的时间小于当前时间，就不允许选择
    // (invalidTimes.includes(selectedValue) &&      !!FILTERTIMES[formItem.prop]
    // if (
    //   dayjs(selectedValue).isBefore(dayjs()) ||
    //   // 如果是riteDateTime，如果是小于bookDateTime之后的一个小时，就不允许选择
    //   (formItem.prop === 'riteDateTime' &&
    //     dayjs(selectedValue).unix() <= dayjs(formData.bookDateTime).unix()) ||
    //   // 如果是handleDateTime，如果是小于riteDateTime之后的一个小时，就不允许选择
    //   (formItem.prop === 'handleDateTime' &&
    //     (dayjs(selectedValue).unix() <=
    //       dayjs(formData.riteDateTime).add(1, 'day').unix() ||
    //       dayjs(selectedValue).unix() <= dayjs(formData.bookDateTime).unix()))
    // ) {
    //   console.error('选择的时间小于当前时间, 不赋值', selectedValue);

    //   // return false;
    //   latestRightDateRef.current = new Date(value);
    // } else {
    latestRightDateRef.current = new Date(selectedValue);
    // }
    setValue(new Date(selectedValue));
  };

  // 过滤时间
  const handleFilter = (type: string, options: any) => {
    const filterTimes = FILTERTIMES[formItem.prop];
    console.log(
      'YMD',
      dayjs(YMD).format('YYYY-MM-DD'),
      dayjs(value).format('YYYY-MM-DD')
    );
    if (type === 'month') {
      return options.filter((option: any) => {
        return option.value >= dayjs().get('month') + 1;
      });
    }
    if (filterTimes && type === 'hour') {
      // 把options里面value包含在filterTimes里值的内容去掉
      if (dayjs(YMD).isSame(dayjs(), 'day')) {
        const minHour = dayjs().add(2, 'hour').hour();
        console.log('最小小时', minHour);
        if (['bookDateTime', 'riteDateTime'].includes(formItem.prop)) {
          console.log('最小小时', minHour);
          return options.filter((option: any) => {
            return (
              filterTimes.includes(option.value) &&
              option.value > dayjs().hour() &&
              option.value > minHour
            );
          });
        }
        return options.filter((option: any) => {
          return (
            filterTimes.includes(option.value) && option.value > dayjs().hour()
          );
        });
      } else if (dayjs(YMD).isBefore(dayjs())) {
        return [];
      } else {
        if (formItem.prop === 'riteDateTime') {
          if (
            !!formData.bookDateTime &&
            dayjs(YMD).isSame(dayjs(formData.bookDateTime), 'day')
          ) {
            const checkDateTime = dayjs(formData.bookDateTime).get('hour');
            console.log('checkDateTime1112', checkDateTime);
            // && option.value > checkDateTime
            return options.filter((option: any) => {
              return filterTimes.includes(option.value);
            });
          }
        }
        if (formItem.prop === 'handleDateTime' && !!formData.riteDateTime) {
          const checkDateTime = dayjs(formData.riteDateTime).add(1, 'day');
          console.log('YMD', dayjs(YMD).format('YYYY-MM-DD'));
          if (dayjs(YMD).isBefore(dayjs(checkDateTime), 'day')) {
            return [];
          } else {
            return options.filter((option: any) => {
              return filterTimes.includes(option.value);
            });
          }
          //  else {
          //   console.log(
          //     'checkDateTime-handleDateTime',
          //     checkDateTime.get('hour')
          //   );
          //   return options.filter((option: any) => {
          //     return filterTimes
          //       .filter((n) => n > checkDateTime.get('hour'))
          //       .includes(option.value);
          //   });
          // }
        }
        return options.filter((option: any) => {
          return filterTimes.includes(option.value);
        });
      }
    }
    return options;
  };

  useEffect(() => {
    console.log(formItem, formData, '===425===');
  }, [formItem.prop]);

  return (
    <>
      <AtList className="flex items-center justify-between">
        <AtListItem
          onClick={() => handleListClick(formItem)}
          title={
            <View>
              {formItem.itemProps?.required ? (
                <Text className="error-dot text-color-red">* </Text>
              ) : null}
              <Text className={`${formItem.error ? 'text-color-red' : ''}`}>
                {formItem.label}
              </Text>
            </View>
          }
          extraText={formData[formItem.prop] || formItem.itemProps.placeholder}
        />
        <Image
          onClick={() => handleListClick(formItem)}
          src={dateIcon}
          mode="widthFix"
          style={{
            width: 20,
            height: 20,
            marginRight: 10,
          }}
        ></Image>
      </AtList>

      <DatePicker
        title={formItem.label}
        // startDate={defaultDate.startDate}
        visible={visible}
        type="datehour"
        // key={renderKey}
        formatter={(type: string, option: PickerOption): any => {
          if (type == 'month') {
            // const isDisabled = dayjs(value)
            //   .set('month', (option.value as number) - 1)
            //   .isBefore(dayjs());
            return {
              label: <View>{option.label}</View>,
              value: option.value,
              // disabled: isDisabled,
            };
          }
          // console.log('year', dayjs().year(), option.value);
          if (type == 'year') {
            const formatCurrentValue = dayjs();
            const isDisabled =
              (option.value as number) < formatCurrentValue.year();
            return {
              label: <View>{option.label}</View>,
              value: option.value,
              // isShow: isDisabled,
            };
          }
          if (type == 'day') {
            // const formatCurrentValue = dayjs(value);
            const isDisabled = dayjs(value)
              .set('date', option.value as number)
              .isBefore(dayjs());
            return {
              label: <View>{option.label}</View>,
              value: option.value,
              // isShow: isDisabled,
            };
          }
          // (invalidTimes.includes(
          //   dayjs(value)
          //     .set('hour', option.value as number)
          //     .format('YYYY/MM/DD HH:00:00')
          // ) &&  !!FILTERTIMES[formItem.prop]
          if (type === 'hour') {
            const isDisabled =
              dayjs(value)
                .set('hour', option.value as number)
                .isBefore(dayjs()) ||
              // 如果是riteDateTime，如果是小于bookDateTime之后的一个小时，就不允许选择
              (formItem.prop === 'riteDateTime' &&
                dayjs(value)
                  .set('hour', option.value as number)
                  .unix() <= dayjs(formData.bookDateTime).unix()) ||
              (formItem.prop === 'handleDateTime' &&
                (dayjs(value)
                  .set('hour', option.value as number)
                  .unix() <=
                  dayjs(formData.riteDateTime).add(1, 'day').unix() ||
                  dayjs(value)
                    .set('hour', option.value as number)
                    .unix() <= dayjs(formData.bookDateTime).unix()));
            return {
              label: <View>{option.label}:00</View>,
              value: `${option.value}`,
              isShow: false,
            };
          }
        }}
        // defaultValue={defaultDate.startDate}
        filter={(type, options) => handleFilter(type, options)}
        value={value}
        onChange={onChange}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />
    </>
  );
}

export default CustomDatePicker;
