import { useState } from 'react';
import { View, Image, Text, PageMeta } from '@tarojs/components';
import { AtList, AtListItem, AtActionSheet } from 'taro-ui';
import WeekSwiper from '../../WeekSwiper/index';
import dateIcon from '../../../assets/imgs/date-icon.png';
import {
  SERVICE_TIME_RANGES,
  RITE_SERVICE_TIME_RANGES,
  HANDLE_TIME_RANGES,
} from '@/constants';
import _ from 'lodash-es';

const FILTERTIMES = {
  bookDateTime: SERVICE_TIME_RANGES,
  riteDateTime: RITE_SERVICE_TIME_RANGES,
  handleDateTime: HANDLE_TIME_RANGES,
};

function CustomDatePicker(props: any) {
  const {
    formItem,
    formData,
    invalidTimes = [],
    invalidRiteTimes = [],
  } = props;
  const [visible, setVisible] = useState(false);

  // 选择时间点击
  const handleListClick = () => {
    setVisible(true);
    props?.setPageStyle && props.setPageStyle(true);
  };

  // 选择时间
  const onChange = (value: any) => {
    props.onChange(value, formItem);
    setVisible(false);
    props?.setPageStyle && props.setPageStyle(false);
  };

  const handleClose = () => {
    setVisible(false);
    props?.setPageStyle && props.setPageStyle(false);
  };

  return (
    <>
      <PageMeta pageStyle={'overflow: hidden;background-color: red'}></PageMeta>
      <AtList className="flex items-center justify-between">
        <AtListItem
          onClick={handleListClick}
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
          onClick={handleListClick}
          src={dateIcon}
          mode="widthFix"
          style={{
            width: 20,
            height: 20,
            marginRight: 10,
          }}
        ></Image>
      </AtList>

      <AtActionSheet
        isOpened={visible}
        onClose={handleClose}
        onCancel={handleClose}
      >
        <View>
          {visible && (
            <WeekSwiper
              items={FILTERTIMES[formItem.prop]}
              formItem={formItem}
              invalidTimes={invalidTimes}
              invalidRiteTimes={invalidRiteTimes}
              formData={formData}
              onChange={onChange}
            />
          )}
        </View>
      </AtActionSheet>
    </>
  );
}

export default CustomDatePicker;
