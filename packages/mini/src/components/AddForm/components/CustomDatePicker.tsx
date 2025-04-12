import { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import { View, Image, Text } from '@tarojs/components';
import { AtList, AtListItem } from 'taro-ui';
import { DatePicker, PickerOption } from '@nutui/nutui-react-taro';
import dateIcon from '../../../assets/imgs/date-icon.png';
import { SERVICE_TIME_RANGES, RITE_SERVICE_TIME_RANGES } from '@/constants';
import { showToast } from '@tarojs/taro';

const FILTERTIMES = {
  bookDateTime: SERVICE_TIME_RANGES,
  riteDateTime: RITE_SERVICE_TIME_RANGES,
};

function CustomDatePicker(props: any) {
  const { formItem, formData } = props;

  const latestRightDateRef = useRef<any>(null);

  const [value, setValue] = useState(() => {
    // 获取时间的最大值
    // 获取formItem里面prop的值
    const currentHour = dayjs().hour() + 1;
    if (!FILTERTIMES[formItem.prop]) {
      return new Date();
    }
    let maxHour = Math.max(currentHour, FILTERTIMES[formItem.prop][0]);
    // 如果maxHour不在FILTERTIMES里面，就取FILTERTIMES的第一个值
    if (!FILTERTIMES[formItem.prop].includes(String(maxHour))) {
      maxHour = FILTERTIMES[formItem.prop][0];
    }
    const rightNow = dayjs().set('hour', maxHour).format('YYYY-MM-DD HH:mm:00');
    return new Date(rightNow);
  });

  const [visible, setVisible] = useState(false);

  // 选择时间点击
  const handleListClick = (formItem: any) => {
    setVisible(true);
  };

  // 取消
  const onCancel = () => {
    setVisible(false);
  };

  // 确定
  const onConfirm = (latestValue: any) => {
    // 判断latestRightDateRef.current的时间跟value是否一致，如果不一致，就不允许选择
    console.log(
      dayjs(latestRightDateRef.current).format('YYYY-MM-DD HH:mm:00'),
      'latestRightDateRef.current',
      dayjs(value).format('YYYY-MM-DD HH:mm:00')
    );
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

    if (afterValue.length < 4) {
      console.error('选择的时间格式错误');
      return false;
    }
    const [{ value: year }, { value: month }, { value: day }, { value: hour }] =
      afterValue;

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
    } else {
      latestRightDateRef.current = new Date(selectedValue);
    }

    setValue(new Date(selectedValue));
  };

  // 过滤时间
  const handleFilter = (type: string, options: any) => {
    const filterTimes = FILTERTIMES[formItem.prop];
    if (filterTimes && type === 'hour') {
      // 把options里面value包含在filterTimes里值的内容去掉
      return options.filter((option: any) => {
        return filterTimes.includes(option.value);
      });
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
      {dayjs(value).format('YYYY-MM-DD HH:mm:00')}
      <DatePicker
        title="上门服务时间"
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
                <View style={{ color: isDisabled ? 'red' : undefined }}>
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
                <View style={{ color: isDisabled ? 'red' : undefined }}>
                  {option.label}
                </View>
              ),
              value: option.value,
              isShow: isDisabled,
            };
          }
          if (type == 'day') {
            // const formatCurrentValue = dayjs(value);
            const isDisabled = dayjs(value)
              .set('date', option.value as number)
              .isBefore(dayjs());
            return {
              label: (
                <View style={{ color: isDisabled ? 'red' : undefined }}>
                  {option.label}
                </View>
              ),
              value: option.value,
              isShow: isDisabled,
            };
          }
          if (type === 'hour') {
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
