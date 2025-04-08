import Taro, { getLocation, chooseLocation } from '@tarojs/taro';
import { useEffect, useImperativeHandle, useState, forwardRef } from 'react';
import {
  Radio,
  RadioGroup,
  Label,
  View,
  Text,
  Picker,
  Checkbox,
  Image,
} from '@tarojs/components';
import {
  AtForm,
  AtInput,
  AtTextarea,
  AtList,
  AtListItem,
  AtSegmentedControl,
  AtMessage,
} from 'taro-ui';
import DateTimePicker from '@/components/DateTimePicker';
import QQMapWX from '@/utils/qqmap-wx-jssdk.min.js';
import locationIcon from '../../assets/imgs/location.png';
import dateIcon from '../../assets/imgs/date-icon.png';
import { formatAddress } from '@/utils';
import PetPicker from '@/components/PetPicker';
import './index.scss';

export default forwardRef((props, ref) => {
  const { formList = [], formModel = {}, handleSubmit } = props;

  const [otherConfig, setOtherConfig] = useState({
    dtPicker: {
      isOpened: false,
      data: {
        formProp: '',
        value: '',
        timeRange: [],
        supportAll: false,
        minDate: {
          month: 0,
          day: 0,
        },
      },
    },
  });

  const [petPickerShow, setPetPickerShow] = useState(false);
  const [_formList, setFormList] = useState(formList);
  const [formData, setFormData] = useState(formModel);
  const [tabIndex, setTabIndex] = useState(0);
  const handleChange = (e, formItem: Record<string, any>) => {
    console.log(e, formItem, 'handleChange46');
    const Obj = { ...formData };
    if (formItem?.type === 'tabs') {
      setTabIndex(e);
      console.log(formItem.tabsOptions[e]?.id, 'handleChange488');
      Obj[formItem.prop] = formItem.tabsOptions[e]?.id;
    } else if (formItem?.type === 'radio') {
      const curObj = _formList.find((item) => item.prop === formItem.prop);

      curObj?.options.forEach((item) => {
        item.checked = item.value === e.detail.value;
      });
      // children?.handleRiteChange?.(e.detail.value);
      if (formItem.prop === 'isRite') {
        _formList.find((item) => item.prop === 'riteDateTime').hidden =
          e.detail.value === '2';
      }
      if (formItem.prop === 'isSelfExpress') {
        _formList.find((item) => item.prop === 'postAddress').hidden =
          e.detail.value === '2';
        _formList.find((item) => item.prop === 'detail').hidden =
          e.detail.value === '2';
      }
      Obj[formItem.prop] = e.detail.value;

      // setFormList([..._formList]);
    } else if (formItem?.type === 'checkbox') {
      if (formItem.prop === 'handleWayCheck') {
        Obj[formItem.prop] = e.detail.value;
      }
    } else if (formItem?.type === 'multiSelector') {
      const selectValues = e.detail.value;
      const getLabel =
        formItem.options[0][selectValues[0]] +
        '/' +
        formItem.options[1][selectValues[1]];
      Obj[formItem.prop] = getLabel;
    } else if (formItem?.type === 'selector') {
      if (formItem.itemProps?.rangeKey) {
        console.log('++++++++++', e.detail.value);
        Obj[formItem.prop] = formItem.options[e.detail.value]?.value;
      } else {
        const getLabel = formItem.options[e.detail.value];
        Obj[formItem.prop] = getLabel;
      }
    } else {
      Obj[formItem.prop] = e;
    }

    props.onFormChange &&
      props?.onFormChange?.(formItem.prop, {
        ...Obj,
      });
    setFormData((f) => {
      return {
        ...f,
        ...Obj,
      };
    });
  };

  const getlocal = (formItem: Record<string, any>) => {
    const QQMapSDK = new QQMapWX({
      key: 'S32BZ-TYNL4-JDVUZ-XMLOV-DIIHS-WBF4J',
      mapStyleId: 'style1', // 个性化地图
    });
    getLocation({
      type: 'gcj02',
      altitude: true,
      success: function (res) {
        console.log(res.longitude);
        QQMapSDK.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude,
          },
          success: function (res) {
            console.log(res);
            const {
              result: {
                // address,
                address_component: { city, district, province, street },
              },
            } = res;
            setFormData({
              ...formData,
              [formItem.prop]: `${province}-${city}${
                district ? '-' + district : ''
              }`,
              detail: street,
              province,
              city,
              area: district,
            });
          },
        });
        // chooseLocation({
        //   latitude: res.latitude,
        //   longitude: res.longitude,
        //   success: function (res) {
        //     console.log(res, "success");
        //   },
        // });
      },
    });
  };
  const handleListClick = (formItem) => {
    console.log('item click46', formItem);

    if (formItem.type === 'picker-date') {
      setOtherConfig((state: any) => {
        return {
          ...state,
          dtPicker: {
            ...state.dtPicker,
            isOpened: true,
            data: {
              ...state.dtPicker.data,
              formProp: formItem.prop,
              timeRange: formItem.timeRange,
              supportAll: formItem.supportAll,
              minDate: formItem.minDate ?? {
                month: 0,
                day: 0,
              },
            },
          },
        };
      });
    } else if (formItem.type === 'location') {
      // _formList.find(
      //   (formItem) => formItem.type === 'location'
      // ).itemProps.placeholder = '正在获取位置...';
      setFormList([..._formList]);
      // getlocal(formItem);
      chooseLocation({
        success: function (res) {
          console.log(res, 'success');
          if (res?.address) {
            const { province, city, district, detail } = formatAddress(
              res.address
            );
            if (!formatAddress(res.address).province) {
              setFormData({
                ...formData,
                [formItem.prop]: res?.address,
              });
            } else {
              setFormData({
                ...formData,
                [formItem.prop]: `${province}-${city}${
                  district ? '-' + district : ''
                }`,
                detail,
                province,
                city,
                area: district,
              });
            }
            props.onFormChange &&
              props.onFormChange(formItem.prop, {
                [formItem.prop]: `${province}-${city}${
                  district ? '-' + district : ''
                }`,
                detail,
                province,
                city,
                area: district,
              });
            console.log(formatAddress(res.address), 'address');
          }
        },
      });
    } else if (formItem.type === 'petPicker') {
      console.log('点击了multiSelector', formItem);
      // props.onPickerColumnChange && props.onPickerColumnChange();
      // setFormList((d) => {
      //   const newList = [...d].map((item) => {
      //     if (item.prop === formItem.prop) {
      //       item.options[1] = PET_SUBTYPES[0];
      //     }
      //     return item;
      //   });
      //   console.log(newList, 'newList');
      //   return newList;
      // });
      setPetPickerShow(true);
    } else if (formItem.type === 'selector') {
      console.log('点击了selector', formItem);
      props.onPickerClick && props.onPickerClick(formItem, formData);
    }
  };

  const handleCloseDateTimePicker = () => {
    setOtherConfig((state) => ({
      ...state,
      dtPicker: {
        ...state.dtPicker,
        isOpened: false,
      },
    }));
  };

  //时间选择确认回调
  const handleDateTimeConfirm = ({ formProp, value }) => {
    setFormData((d) => {
      d[formProp] = value;
      //筛选可以预约的时间段
      props.filterTimes && props.filterTimes(formProp, value, d);
      return d;
    });
  };

  //pickerCloumn更改回调
  const handleDatePickerColumn = ({
    propName,
    value,
    setAvailableRanges,
    selectedTime,
  }) => {
    console.log('选择日期的值', propName, value);
    // setFormData({
    //   ...formData,
    //   [formProp]: value,
    // });
    props.onDatePickColumnChange &&
      props.onDatePickColumnChange(
        propName,
        value,
        setAvailableRanges,
        selectedTime,
        formData
      );
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const newState = { ...formData };
    console.log('validateForm', formData);

    _formList.forEach((item) => {
      const currentValue = formData[item.prop] || '';
      let errorMsg = '';

      if (item.itemProps?.required && !currentValue.trim()) {
        errorMsg = `${item.label}不能为空`;
      } else if (item.validator) {
        errorMsg = item.validator(currentValue) || '';
      }

      if (errorMsg) {
        isValid = false;
        item.error = true;
        //   newState[item.prop] = {
        //     ...newState[item.prop],
        //     error: errorMsg,
        //   };
      }
    });

    if (!isValid) {
      Taro.atMessage({
        message: '请检查表单输入',
        type: 'error',
      });
    }

    setFormData(newState);
    return isValid;
  };

  const handleColumnChange = (e: any, formItem: any) => {
    console.log('handleColumnChange', e, formItem);
    props.onPickerColumnChange && props.onPickerColumnChange(e.detail);
  };

  // const handlePickerColumnChange = (formProp, formItem) => {
  //   console.log('handlePickerColumnChange', formProp, formItem);
  //   props.onPickerColumnChange && props.onPickerColumnChange(propName, value);
  // };
  //提交表单
  const onSubmit = () => {
    console.log('提交表单', formData);
    if (!validateForm()) return {};

    const formValues = Object.keys(formData).reduce((acc, key) => {
      acc[key] = formData[key] || '';
      return acc;
    }, {} as Record<string, string>);

    console.log(formValues);
    handleSubmit?.(formValues);
  };
  const onReset = (value) => {
    console.log(value);
    setFormData(formModel);
  };

  useImperativeHandle(ref, () => ({
    onReset,
    onSubmit,
    getFormValues: () => {
      return formData;
    },
  }));

  useEffect(() => {
    setFormList(formList);
  }, [formList]);

  useEffect(() => {
    // console.log('首次加载FormModel46', formModel);
    setFormData(formModel);
  }, [formModel]);

  return (
    <>
      {/* qqqqq-{JSON.stringify(otherConfig.dtPicker.isOpened)}
      <View>--------</View>
      formData-{JSON.stringify(formData)} */}
      <AtForm className="addForm" onSubmit={onSubmit} onReset={onReset}>
        {_formList.map((formItem, index) => (
          <>
            {['digit', 'input'].includes(formItem.type) && !formItem.hidden ? (
              <AtInput
                key={index}
                name={formItem.prop}
                type={formItem.type}
                error={formItem?.error || false}
                cursor={1000}
                clear
                maxLength={formItem.itemProps?.maxLength || 100}
                title={formItem.label}
                placeholder={formItem.itemProps.placeholder}
                required={formItem.itemProps?.required || false}
                value={formData[formItem.prop]}
                onChange={(e) => handleChange(e, formItem)}
              />
            ) : null}
            {formItem.type === 'phone' && !formItem.hidden ? (
              <AtInput
                key={index}
                name={formItem.prop}
                type="phone"
                title={formItem.label}
                clear
                maxlength={11}
                cursor={1000}
                error={formItem?.error || false}
                placeholder={formItem.itemProps.placeholder}
                value={formData[formItem.prop]}
                onChange={(e) => handleChange(e, formItem)}
                required={formItem.itemProps?.required || false}
                maxLength={formItem.maxLength || 12}
              />
            ) : null}
            {formItem.type === 'radio' && !formItem.hidden ? (
              <View
                className="flex items-center justify-between customItem"
                key={index}
              >
                <View className="label">
                  {formItem.itemProps?.required ? (
                    <Text className="error-dot text-color-red">* </Text>
                  ) : null}
                  <Text className={`${formItem.error ? 'text-color-red' : ''}`}>
                    {formItem.label}
                  </Text>
                </View>

                <RadioGroup
                  name={formItem.prop}
                  className="radioGroup"
                  onChange={(e) => handleChange(e, formItem)}
                >
                  {formItem?.options?.map((item, i) => {
                    return (
                      <Label className="radioItem" for={i} key={i}>
                        <Radio
                          value={item.value}
                          checked={item.value == formData[formItem.prop]}
                        >
                          {item.label}
                        </Radio>
                      </Label>
                    );
                  })}
                </RadioGroup>
              </View>
            ) : null}
            {formItem.type === 'checkbox' && !formItem.hidden ? (
              <View
                className="flex items-center justify-between customItem"
                key={index}
              >
                <Text></Text>
                {formItem?.options?.map((item, i) => {
                  return (
                    <Label className="checkboxItem" for={i} key={i}>
                      <Checkbox value={item.value} checked={item.checked}>
                        {item.label}
                      </Checkbox>
                    </Label>
                  );
                })}
              </View>
            ) : null}
            {formItem.type === 'textarea' && !formItem.hidden ? (
              <View className="customItem" key={index}>
                <View className="mb-20 label">
                  {formItem.itemProps?.required ? (
                    <Text className="error-dot text-color-red">* </Text>
                  ) : null}
                  <Text className={`${formItem.error ? 'text-color-red' : ''}`}>
                    {formItem.label}
                  </Text>
                </View>
                <AtTextarea
                  key={index}
                  placeholder={formItem.itemProps.placeholder}
                  value={formData[formItem.prop]}
                  onChange={(e) => handleChange(e, formItem)}
                />
              </View>
            ) : null}
            {formItem.type === 'picker-date' && !formItem.hidden ? (
              <View className="relative formItemView" key={index}>
                {/* <Picker
                mode={formItem.type.split("-")[1]}
                onChange={(e) => handleChange(e, formItem)}
                value={formData[formItem.prop]}
              >
                <AtList>
                  <AtListItem
                    title={formItem.label}
                    arrow="right"
                    extraText={formItem.itemProps.placeholder}
                  />
                </AtList>
              </Picker> */}
                <AtList className="flex items-center justify-between">
                  <AtListItem
                    onClick={() => handleListClick(formItem)}
                    title={
                      <View>
                        {formItem.itemProps?.required ? (
                          <Text className="error-dot text-color-red">* </Text>
                        ) : null}
                        <Text
                          className={`${
                            formItem.error ? 'text-color-red' : ''
                          }`}
                        >
                          {formItem.label}
                        </Text>
                      </View>
                    }
                    extraText={
                      formData[formItem.prop] || formItem.itemProps.placeholder
                    }
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
              </View>
            ) : null}
            {formItem.type === 'location' && !formItem.hidden ? (
              <View className="formItemView" key={index}>
                <AtList className="flex items-center justify-between">
                  <AtListItem
                    onClick={() => handleListClick(formItem)}
                    title={
                      <View>
                        {formItem.itemProps?.required ? (
                          <Text className="error-dot text-color-red">* </Text>
                        ) : null}
                        <Text
                          className={`${
                            formItem.error ? 'text-color-red' : ''
                          }`}
                        >
                          {formItem.label}
                        </Text>
                      </View>
                    }
                    extraText={
                      formData[formItem.prop] || formItem.itemProps.placeholder
                    }
                  />
                  <Image
                    src={locationIcon}
                    mode="widthFix"
                    style={{
                      width: 20,
                      height: 20,
                      marginRight: 10,
                    }}
                  ></Image>
                </AtList>
              </View>
            ) : null}

            {formItem.type === 'petPicker' && !formItem.hidden ? (
              <View className="formItemView" key={index}>
                <AtList className="flex items-center justify-between">
                  <AtListItem
                    onClick={() => handleListClick(formItem)}
                    title={
                      <View>
                        {formItem.itemProps?.required ? (
                          <Text className="error-dot text-color-red">* </Text>
                        ) : null}
                        <Text
                          className={`${
                            formItem.error ? 'text-color-red' : ''
                          }`}
                        >
                          {formItem.label}
                        </Text>
                      </View>
                    }
                    extraText={
                      formData[formItem.prop]
                        ? formData[formItem.prop] +
                            '/' +
                            formData[formItem.subProp] || ''
                        : formItem.itemProps.placeholder
                    }
                  />
                </AtList>
              </View>
            ) : null}

            {['multiSelector', 'selector'].includes(formItem.type) &&
            !formItem.hidden ? (
              <Picker
                range={formItem?.options}
                mode={formItem.type}
                onChange={(e) => handleChange(e, formItem)}
                value={formData[formItem.prop]}
                rangeKey={formItem?.itemProps?.rangeKey}
                key={index}
                // onColumnChange={(e) => handleColumnChange(e, formItem)}
              >
                <AtList>
                  <AtListItem
                    onClick={() => handleListClick(formItem)}
                    title={
                      <View>
                        {formItem.itemProps?.required ? (
                          <Text
                            className={`error-dot ${
                              !formItem[formItem.prop] ? 'text-color-red' : ''
                            }`}
                          >
                            *{' '}
                          </Text>
                        ) : null}
                        <Text
                          className={`${
                            formItem.error ? 'text-color-red' : ''
                          }`}
                        >
                          {formItem.label}
                        </Text>
                      </View>
                    }
                    arrow="right"
                    extraText={
                      formItem.options?.find(
                        (item) => item.value === formData[formItem.prop]
                      )?.label ?? formItem.itemProps.placeholder
                    }
                  />
                </AtList>
              </Picker>
            ) : null}

            {formItem.type === 'tabs' && !formItem.hidden ? (
              <View className="tabs customItem" key={index}>
                <View className="flex items-center">
                  <View className="label">
                    {formItem.itemProps?.required ? (
                      <Text className="error-dot text-color-red">* </Text>
                    ) : null}
                    <Text
                      className={`${formItem.error ? 'text-color-red' : ''}`}
                    >
                      {formItem.label}
                    </Text>
                  </View>
                  {formItem.tabsOptions?.length ? (
                    <AtSegmentedControl
                      values={formItem.tabsTitle}
                      current={tabIndex}
                      onClick={(e) => handleChange(e, formItem)}
                    ></AtSegmentedControl>
                  ) : null}
                </View>
                {formItem.tabsOptions[tabIndex]?.content && (
                  <View className="tab-content">
                    {formItem.tabsOptions[tabIndex]?.content}
                  </View>
                )}
              </View>
            ) : null}
          </>
        ))}
      </AtForm>
      {/* 日期时间组件 */}
      <DateTimePicker
        isOpened={otherConfig.dtPicker.isOpened}
        data={otherConfig.dtPicker.data}
        onConfirm={handleDateTimeConfirm}
        onClose={handleCloseDateTimePicker}
        onDatePickerColumn={handleDatePickerColumn}
      >
        <Text>slot</Text>
      </DateTimePicker>

      <PetPicker
        isShow={petPickerShow}
        onConfirm={(info) => {
          console.log(info, '宠物选择器的值');
          props.onFormChange &&
            props?.onFormChange?.('petPicker', {
              ...info,
            });
          setFormData((prev) => {
            return {
              ...prev,
              ...info,
            };
          });
        }}
        onClose={() => setPetPickerShow(false)}
      ></PetPicker>

      <AtMessage />
    </>
  );
});
