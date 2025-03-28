import Taro, { getLocation } from '@tarojs/taro';
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
  AtIcon,
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
import './index.scss';
export default forwardRef((props, ref) => {
  const { formList = [], formModel = {}, children, handleSubmit } = props;

  const [otherConfig, setOtherConfig] = useState({
    dtPicker: {
      isOpened: false,
      data: {
        formProp: '',
        value: '',
      },
    },
  });
  const [_formList, setFormList] = useState([]);
  const [formData, setFormData] = useState({});
  const [tabIndex, setTabIndex] = useState(0);
  const handleChange = (e, formItem: Record<string, any>) => {
    console.log(e, formItem, 'handleChange');
    const _formData = { ...formData };

    if (formItem?.type === 'tabs') {
      setTabIndex(e);
      _formData[formItem.prop] = formItem.tabsOptions[e]?.id;
      setFormData({
        ..._formData,
        [formItem.prop]: formItem.tabsOptions[e]?.id,
      });
    } else if (formItem?.type === 'radio') {
      _formData[formItem.prop] = e.detail.value;
      const curObj = _formList.find((item) => item.prop === formItem.prop);

      curObj?.options.forEach((item) => {
        item.checked = item.value === e.detail.value;
      });
      // children?.handleRiteChange?.(e.detail.value);
      if (formItem.prop === 'isRite') {
        _formList.find((item) => item.prop === 'riteDateTime').hidden =
          e.detail.value === '0';
        console.log('isRite', e.detail.value, '++++++');
      } else if (formItem.prop === 'handleWay') {
        console.log(e.detail.value, 'e.detail.value');
        formData['handleWayCheck'] = '';
        _formList.find((item) => item.prop === 'handleWayCheck').hidden =
          e.detail.value !== '3';
        if (e.detail.value === '3') formData['handleDateTime'] = null;
        _formList.find((item) => item.prop === 'handleDateTime').hidden =
          e.detail.value === '3';
      }

      setFormData({
        ..._formData,
        [formItem.prop]: e.detail.value,
      });
      setFormList([..._formList]);
    } else if (formItem?.type === 'checkbox') {
      if (formItem.prop === 'handleWayCheck') {
        _formData[formItem.prop] = e.detail.value;
        const curObj = _formList.find((item) => item.prop === formItem.prop);
        console.log(curObj);
        // curObj?.options.forEach((item) => {
        //   item.checked = item.value === e.detail.value;
        // });
        // // children?.handleRiteChange?.(e.detail.value);
        // _formList.find((item) => item.prop === "legcyWayCheck").hidden =
        //   e.detail.value === "0";
        setFormData({
          ..._formData,
          [formItem.prop]: e.detail.value,
        });
        setFormList([..._formList]);
      }
    } else if (formItem?.type === 'multiSelector') {
      const selectValues = e.detail.value;
      const getLabel =
        formItem.options[0][selectValues[0]] +
        '/' +
        formItem.options[1][selectValues[1]];
      formData[formItem.prop] = getLabel;
      setFormData({
        ..._formData,
        [formItem.prop]: getLabel,
      });
    } else {
      _formData[formItem.prop] = e;
      setFormData((d) => {
        return {
          ...d,
          [formItem.prop]: e,
        };
      });
    }
    console.log(_formData);
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
              [formItem.prop]: `${province}-${city}-${district}`,
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
    console.log('item click', formItem);

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
            },
          },
        };
      });
    } else if (formItem.type === 'location') {
      _formList.find(
        (formItem) => formItem.type === 'location'
      ).itemProps.placeholder = '正在获取位置...';
      setFormList([..._formList]);
      getlocal(formItem);
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
    console.log('选择时间的值', formProp, value);
    setFormData({
      ...formData,
      [formProp]: value,
    });
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
    setFormData(formModel);
  }, [formModel]);

  //初始化数据
  useEffect(() => {
    console.log('初始化', formModel);
    const collectData = {};
    _formList?.forEach((item) => {
      if (item.type === 'radio') {
        // Check if

        if (!!formData[item.prop]) {
          const selectIndex = item.options.findIndex(
            (item) => item.value === formData[item.prop]
          );
          item.options[selectIndex].checked = true;
          return;
        }
        collectData[item.prop] =
          formData[item.prop] ??
          (item.options.find((option) => option.checked)?.value ||
            item.options[0].value);

        setFormData({
          ...formData,
          ...collectData,
        });
      }
    });
  }, []);

  return (
    <>
      {/* qqqqq-{JSON.stringify(otherConfig.dtPicker.isOpened)}
      <View>--------</View>
      formData-{JSON.stringify(formData)} */}
      <AtForm className="addForm" onSubmit={onSubmit} onReset={onReset}>
        {_formList.map((formItem, index) => (
          <>
            {['digit', 'input'].includes(formItem.type) ? (
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
            {formItem.type === 'phone' ? (
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
            {formItem.type === 'radio' ? (
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
                        <Radio value={item.value} checked={item.checked}>
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
            {formItem.type === 'textarea' ? (
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
            {formItem.type === 'location' ? (
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
            {formItem.type === 'multiSelector' ? (
              <Picker
                range={formItem?.options}
                mode="multiSelector"
                onChange={(e) => handleChange(e, formItem)}
                value={formData[formItem.prop]}
                key={index}
              >
                <AtList>
                  <AtListItem
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
                      formData[formItem.prop] ?? formItem.itemProps.placeholder
                    }
                  />
                </AtList>
              </Picker>
            ) : null}
            {formItem.type === 'tabs' ? (
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
                  <AtSegmentedControl
                    values={formItem.tabsTitle}
                    current={tabIndex}
                    onClick={(e) => handleChange(e, formItem)}
                  ></AtSegmentedControl>
                </View>
                {
                  <View className="tab-content">
                    {formItem.tabsOptions[tabIndex]?.content || '暫無內容'}
                  </View>
                }
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
      >
        <Text>slot</Text>
      </DateTimePicker>
      <AtMessage />
    </>
  );
});
