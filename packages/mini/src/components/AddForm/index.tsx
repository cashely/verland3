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

import QQMapWX from '@/utils/qqmap-wx-jssdk.min.js';
import locationIcon from '../../assets/imgs/location.png';
import dateIcon from '../../assets/imgs/date-icon.png';
import { formatAddress } from '@/utils';
import PetPicker from '@/components/PetPicker';
import CustomDatePicker from './components/CustomDatePicker';
import './index.scss';

export default forwardRef((props, ref) => {
  const {
    formList = [],
    formModel = {},
    handleSubmit,
    invalidTimes = [],
  } = props;

  const [petPickerShow, setPetPickerShow] = useState(false);
  const [_formList, setFormList] = useState(formList);
  const [formData, setFormData] = useState(formModel);
  const [tabIndex, setTabIndex] = useState(0);
  const handleChange = (e, formItem: Record<string, any>) => {
    if (formItem?.type === 'tabs') {
      setTabIndex(e);
      console.log(formItem.tabsOptions[e]?.id, 'handleChange488');
      formData[formItem.prop] = formItem.tabsOptions[e]?.id;
    } else if (formItem?.type === 'radio') {
      const curObj = _formList.find((item) => item.prop === formItem.prop);

      curObj?.options.forEach((item) => {
        item.checked = item.value === e.detail.value;
      });
      // children?.handleRiteChange?.(e.detail.value);
      // if (formItem.prop === 'isRite') {
      //   _formList.find((item) => item.prop === 'riteDateTime').hidden =
      //     e.detail.value === '2';
      // }
      formData[formItem.prop] = e.detail.value;
    } else if (formItem?.type === 'multiSelector') {
      const selectValues = e.detail.value;
      const getLabel =
        formItem.options[0][selectValues[0]] +
        '/' +
        formItem.options[1][selectValues[1]];
      formData[formItem.prop] = getLabel;
    } else if (formItem?.type === 'selector') {
      if (formItem.itemProps?.rangeKey) {
        console.log('++++++++++', e.detail.value);
        formData[formItem.prop] = formItem.options[e.detail.value]?.value;
      } else {
        const getLabel = formItem.options[e.detail.value];
        formData[formItem.prop] = getLabel;
      }
    } else {
      // console.log('++++++++++411', formItem.prop, e, formData);
      formData[formItem.prop] = e;
    }
    props.onFormChange && props?.onFormChange?.(formItem.prop, formData);
  };

  useEffect(() => {
    console.log('formData41111', formData);
  }, [formData]);

  const handleListClick = (formItem) => {
    console.log('item click46', formItem);

    if (formItem.type === 'picker-date') {
      props.onPickerClick && props.onPickerClick(formItem, formData);
    } else if (formItem.type === 'location') {
      // setFormList([..._formList]);
      // getlocal(formItem);
      chooseLocation({
        success: function (res) {
          console.log(res, 'success');
          if (res?.address) {
            const { province, city, district, detail } = formatAddress(
              res.address
            );
            if (formatAddress(res.address).province) {
              // setFormData({
              //   ...formData,
              //   [formItem.prop]: res?.address,
              // });
              props.onFormChange &&
                props.onFormChange(formItem.prop, {
                  ...formData,
                  [formItem.prop]: res.name,

                  //`${province}-${city}${
                  //district ? '-' + district : ''
                  //}`,
                  detail: res.address,
                  province,
                  city,
                  area: district,
                });
            }
            console.log('formData411在location', formData);
            console.log(formatAddress(res.address), 'address');
          }
        },
      });
    } else if (formItem.type === 'petPicker') {
      console.log('点击了multiSelector', formItem);
      setPetPickerShow(true);
    }
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

  useImperativeHandle(ref, () => ({
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
    console.log('宠物选择', formModel);
    setFormData(formModel);
  }, [formModel]);

  return (
    <>
      {/* qqqqq-{JSON.stringify(otherConfig.dtPicker.isOpened)}
      <View>--------</View>
      formData-{JSON.stringify(formData)} */}
      <AtForm className="addForm" onSubmit={onSubmit}>
        {_formList.map((formItem, index) => (
          <>
            {['text'].includes(formItem.type) && !formItem.hidden ? (
              <View className="formItemView" key={index}>
                <AtList className="flex items-center justify-between">
                  <AtListItem
                    title={formItem.label}
                    extraText={formData[formItem.prop] || 'xxxx'}
                  />
                </AtList>
              </View>
            ) : null}
            {['digit', 'input'].includes(formItem.type) && !formItem.hidden ? (
              <AtInput
                key={index}
                name={formItem.prop}
                type={formItem.type}
                error={formItem?.error || false}
                cursor={1000}
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
                <CustomDatePicker
                  formItem={formItem}
                  formData={formData}
                  onChange={handleChange}
                  invalidTimes={invalidTimes}
                />
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

      <PetPicker
        isShow={petPickerShow}
        onConfirm={(info) => {
          console.log('宠物选择', info);
          props.onFormChange &&
            props?.onFormChange?.('petPicker', {
              ...info,
            });
          // setFormData((prev) => {
          //   return {
          //     ...prev,
          //     ...info,
          //   };
          // });
        }}
        onClose={() => setPetPickerShow(false)}
      ></PetPicker>

      <AtMessage />
    </>
  );
});
