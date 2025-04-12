import { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import toObject from 'dayjs/plugin/toObject';
import { View, Image, Text } from '@tarojs/components';
import { AtList, AtListItem } from 'taro-ui';
import { DatePicker, PickerOption } from '@nutui/nutui-react-taro';
import dateIcon from '../../../assets/imgs/date-icon.png';
import { SERVICE_TIME_RANGES, RITE_SERVICE_TIME_RANGES } from '@/constants';
import { showToast } from '@tarojs/taro';
dayjs.extend(toObject);

const FILTERTIMES = {
  bookDateTime: SERVICE_TIME_RANGES,
  riteDateTime: RITE_SERVICE_TIME_RANGES,
  handleDateTime: SERVICE_TIME_RANGES,
  expressDateTime: SERVICE_TIME_RANGES,
};

function CustomDatePicker(props: any) {
  const { formItem, formData } = props;

  const latestRightDateRef = useRef<any>(null);

  const [value, setValue] = useState(() => {
    // 获取时间的最大值
    // 获取formItem里面prop的值
    const currentHour = dayjs().hour();
    console.log('currentHour', currentHour);
    //过滤已经过期的时间段
    const filterTimes = FILTERTIMES[formItem.prop].filter((n) => {
      return n > currentHour;
    });
    if (!filterTimes) {
      return new Date();
    }
    let maxHour = Math.max(currentHour, filterTimes[0]);

    // 如果maxHour不在FILTERTIMES里面，就取FILTERTIMES的第一个值
    if (!filterTimes.includes(String(maxHour))) {
      maxHour = filterTimes[0];
    }
    const rightNow = dayjs().set('hour', maxHour).format('YYYY-MM-DD HH:mm:00');
    console.log('rightNow', maxHour, rightNow);
    return new Date(rightNow);
  });

  const [visible, setVisible] = useState(false);
  //当前选中的日期所对应的不可选时间段
  const [curSelectedInvalidTimes, setCurSelectedInvalidTimes] = useState<
    string[]
  >([]);

  const [filterTimes1, setFilterTimes] = useState<string[]>([]);
  // 选择时间点击
  const handleListClick = (formItem: any) => {
    console.log('formItem', formItem, '点击了时间');
    setVisible(true);
  };

  function getDefaultDate() {
    const currentHour = dayjs().hour();
    console.log('currentHour', currentHour);
    //过滤已经过期的时间段
    const filterTimes = FILTERTIMES[formItem.prop].filter((n) => {
      return n > currentHour;
    });
    if (!filterTimes) {
      return new Date();
    }
    let maxHour = Math.max(currentHour, filterTimes[0]);

    // 如果maxHour不在FILTERTIMES里面，就取FILTERTIMES的第一个值
    if (!filterTimes.includes(String(maxHour))) {
      maxHour = filterTimes[0];
    }
    const rightNow = dayjs().set('hour', maxHour).format('YYYY-MM-DD HH:mm:00');
    console.log('rightNow', maxHour, rightNow);
    return new Date(rightNow);
  }

  useEffect(() => {
    if (props.formItem.prop === 'expressDateTime') {
      //如果有预约时间
      setValue(getDefaultDate());
    }
  }, [visible]);

  // 取消
  const onCancel = () => {
    setVisible(false);
  };

  useEffect(() => {
    console.log('选择的时间', value);
    console.log(
      '选择的时间',
      dayjs().isAfter(dayjs()),
      dayjs().toObject(),
      dayjs(value).format('YYYY-MM-DD HH:mm:00')
    );
    const curFormItem = props.formItem;
    if (curFormItem.prop === 'bookDateTime') {
      const selectedDate = dayjs(value).format('YYYY-MM-DD');
      const invalidTimes = curFormItem?.invalidTimes?.filter((item) =>
        item.includes(selectedDate)
      );

      setCurSelectedInvalidTimes(invalidTimes.map((n) => n.split(' ')[1]));
    }
  }, [value]);

  useEffect(() => {
    console.log('visible', curSelectedInvalidTimes);
  }, [curSelectedInvalidTimes]);

  // 确定
  const onConfirm = (latestValue: any, options: any) => {
    // 判断latestRightDateRef.current的时间跟value是否一致，如果不一致，就不允许选择
    console.log(
      dayjs(latestRightDateRef.current).format('YYYY-MM-DD HH:mm:00'),
      'latestRightDateRef.current',
      dayjs(value).format('YYYY-MM-DD HH:mm:00'),
      latestValue,
      options
    );
    const lastItem = latestValue[latestValue.length - 1];
    if (latestValue?.some((o) => o.disabled)) {
      // if (lastItem?.isDisabled) {
      return showToast({
        title: '该时间段不可选!',
        icon: 'none',
      });
      // }
      //  else {
      //   return showToast({
      //     title: '置灰时间段不可选!',
      //     icon: 'none',
      //   });
      // }
    }
    if (
      latestRightDateRef.current &&
      dayjs(latestRightDateRef.current).format('YYYY-MM-DD HH:mm:00') !==
        dayjs(value).format('YYYY-MM-DD HH:mm:00')
    ) {
      showToast({
        title: '当前时间不可选',
        icon: 'none',
      });
      return;
    }
    // 修改外部的值
    const [{ value: year }, { value: month }, { value: day }, { value: hour }] =
      latestValue;

    const selectedValue = `${year}-${month}-${day} ${hour}:00`;
    props.onChange(selectedValue, formItem);
    onCancel();
  };

  // 选择时间
  const onChange = (afterValue: any) => {
    // 修改内部的值
    console.log('选择之前的时间', value);
    console.log('选择的时间value', afterValue);

    // if (afterValue.length < 4) {
    //   console.error('选择的时间格式错误');
    //   return false;
    // }

    const year = afterValue[0].value;
    const month = afterValue[1].value;
    const day = afterValue[2].value;
    const hour = afterValue[3]?.value || '00';
    // const [{ value: year }, { value: month }, { value: day }, { value: hour  }] =
    //   afterValue;

    const selectedValue = `${year}/${month}/${day} ${hour}:00`;
    console.log(selectedValue, '最后格式化赋值的时间');
    // 如果选择的时间小于当前时间，就不允许选择
    if (dayjs(selectedValue).isBefore(dayjs())) {
      console.error('选择的时间小于当前时间, 不赋值', selectedValue);
      showToast({
        title: '当前时间不可选',
        icon: 'none',
      });
      // return false;
      latestRightDateRef.current = new Date(value);
      resetFlag.current = true;
    } else {
      latestRightDateRef.current = new Date(selectedValue);
    }

    setValue(new Date(selectedValue));
  };

  const resetFlag = useRef(false);
  function compareMonths(date1, date2) {
    if (date1.isAfter(date2, 'month')) return 1;
    if (date1.isBefore(date2, 'month')) return -1;
    return 0;
  }

  // 过滤时间
  const handleFilter = (type: string, options: any) => {
    console.log('过滤时间filterTimes', filterTimes1);

    console.log(
      '过滤时间',
      dayjs(props.formData?.bookDateTime).format('YYYY-MM-DD HH:mm'),
      formItem.prop,
      dayjs(value).format('YYYY-MM-DD'),
      latestRightDateRef.current
    );
    const currentHour = dayjs().hour();
    let filterTimes = FILTERTIMES[formItem.prop];
    if (props.formData?.bookDateTime && filterTimes) {
      const bookDateTime = dayjs(props.formData?.bookDateTime);
      if (bookDateTime.isSame(dayjs())) {
        filterTimes = filterTimes.filter((n) => n > bookDateTime.hour());
      }
    }
    if (visible && latestRightDateRef?.current) {
      //标识已经打开了日期弹框进行滑动操作
      console.log(
        '日期比较====开始',
        dayjs(latestRightDateRef.current).format('YYYY-MM-DD HH:mm'),
        dayjs().format('YYYY-MM-DD HH:mm'),
        dayjs(value).format('YYYY-MM-DD HH:mm')
      );

      if (dayjs(latestRightDateRef.current).isSame(dayjs(), 'day')) {
        console.log('日期比较,等于');
        filterTimes = filterTimes.filter((n) => n > currentHour);
      } else if (dayjs(latestRightDateRef.current).isAfter(dayjs(), 'day')) {
        console.log('日期比较,大于');
        filterTimes = FILTERTIMES[formItem.prop];
      } else if (dayjs(latestRightDateRef.current).isBefore(dayjs(), 'day')) {
        console.log('日期比较,小于');
        filterTimes = [];
        if (type === 'hour') {
          return options.filter((option: any) =>
            filterTimes.includes(option.value)
          );
        }
      }
    } else {
      filterTimes = filterTimes.filter((n) => n > currentHour);
    }

    if (type === 'hour') {
      if (filterTimes.length) {
        // 把options里面value包含在filterTimes里值的内容去掉
        return options.filter((option: any) => {
          console.log('option.value', option.value);
          const currentHour = dayjs().hour();
          if (props.formItem.prop === 'bookDateTime') {
            return filterTimes.includes(option.value);
          } else {
            // &&
            //   (option.value as number) > dayjs(value).hour()
            console.log(dayjs(props.formData?.bookDateTime).hour(), 'xxxxx');
            return (
              filterTimes.includes(option.value) &&
              (option.value as number) >
                Math.max(
                  dayjs(props.formData?.bookDateTime).hour(),
                  currentHour
                )
            );
          }
        });
      } else {
        return options.filter((option: any) =>
          filterTimes.includes(option.value)
        );
      }
    }
    return options;
  };

  useEffect(() => {
    console.log(formItem, formData, '======');
  }, []);

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
          src={dateIcon}
          mode="widthFix"
          style={{
            width: 20,
            height: 20,
            marginRight: 10,
          }}
        ></Image>
      </AtList>
      {/* {dayjs(value).format('YYYY-MM-DD HH:mm:00')} */}
      <DatePicker
        title={props.formItem.label}
        // startDate={defaultDate.startDate}
        visible={visible}
        type="datehour"
        // key={renderKey}
        formatter={(type: string, option: PickerOption): any => {
          if (type == 'month') {
            const isDisabled = dayjs(value)
              .set('month', (option.value as number) - 1)
              .isBefore(dayjs());
            return {
              label: (
                <View style={{ color: isDisabled ? '#bbb' : undefined }}>
                  {option.label}
                </View>
              ),
              value: option.value,
              disabled: isDisabled,
            };
          }
          // console.log('year', dayjs().year(), option.value);
          if (type == 'year') {
            const formatCurrentValue = dayjs();
            const isDisabled =
              (option.value as number) < formatCurrentValue.year();
            return {
              label: (
                <View style={{ color: isDisabled ? '#bbb' : undefined }}>
                  {option.label}
                </View>
              ),
              value: option.value,
              isDisabled: isDisabled,
            };
          }
          if (type == 'day') {
            // const formatCurrentValue = dayjs(value);
            const isDisabled = dayjs(value)
              .set('date', option.value as number)
              .isBefore(dayjs());
            return {
              label: (
                <View style={{ color: isDisabled ? '#bbb' : undefined }}>
                  {option.label}
                </View>
              ),
              value: option.value,
              isDisabled: isDisabled,
            };
          }
          if (type === 'hour') {
            return {
              label: <View>{option.label}:00</View>,
              value: `${option.value}`,
              isDisabled: curSelectedInvalidTimes?.includes(
                option.value as string
              ),
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
