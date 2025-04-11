import { useState, useRef, useEffect, Suspense } from 'react';
import { View, Label, Checkbox, Text, CheckboxGroup } from '@tarojs/components';
import { useLoad, showToast, navigateTo, setStorageSync } from '@tarojs/taro';
import { AtButton, AtToast } from 'taro-ui';
import { otherFormList, baseInfoFormList } from './model';
import AddForm from '@/components/AddForm';
import {
  SERVICE_TIME_RANGES,
  RITE_SERVICE_TIME_RANGES,
  PET_RECEIVE_WAYS,
} from '@/constants';
import regexObj from '@/utils/regexObj';
//import AppContext from '@/hooks/useContext';
import { storeList } from '@/apis/pet';
import { isBooked } from '@/apis/book';
import { menu } from '@/apis/common';
import dayjs from 'dayjs';
import { DatePicker, PickerOption } from '@nutui/nutui-react-taro';

import './index.scss';

const obj = {
  bookDateTime: SERVICE_TIME_RANGES,
  riteDateTime: RITE_SERVICE_TIME_RANGES,
  handleDateTime: SERVICE_TIME_RANGES,
  expressDateTime: SERVICE_TIME_RANGES,
};

export default () => {
  const baseInfoRef = useRef(null);
  const otherInfoRef = useRef(null);
  const [agreement, setAggreement] = useState('');
  const [menuList, setMenuList] = useState([]);
  const [isMenuA, setIsMenuA] = useState(false);
  const [formModel, setformModel] = useState({
    isRite: '1',
    handleWay: '2',
    // isSelfExpress: '1',
    expressWay: '1',
  });
  useLoad(() => {
    console.log('Page loaded.');
    _setOtherFormList(otherFormList);
  });
  const [_otherFormList, _setOtherFormList] = useState(otherFormList);
  const [_baseInfoFormList, _setBaseInfoFormList] = useState(baseInfoFormList);
  const [invalidTimes, setInvalidTimes] = useState<string[]>([]);
  const toast = (text: string) => {
    showToast({
      title: text,
      icon: 'none',
    });
  };

  const getExpressOptions = (menuId: string) => {
    const wayIds = menuList.find((o) => o.id === menuId)?.expressWays;
    console.log('wayIds', wayIds);

    _otherFormList.forEach((item) => {
      if (item.prop === 'expressWay') {
        item.options = PET_RECEIVE_WAYS.filter((o) =>
          wayIds?.includes(o.value)
        );
        item.hidden = !wayIds?.length;
      }
      if (item.prop === 'expressAddress') {
        item.hidden = !wayIds?.length;
      }
    });
    console.log(_otherFormList, '_otherFormList');
    _setOtherFormList(_otherFormList);
  };

  useEffect(() => {
    menu().then((res) => {
      if (res?.code === 200) {
        setformModel((d) => {
          return {
            ...d,
            menuId: res.data[0]?.id, // 处理方式
          };
        });
        const menus =
          res?.data.map((iten) => ({
            ...iten,
          })) || [];
        console.log(menus, 'menus');
        setMenuList(menus);
      }
    });
    isBooked({
      start: dayjs().startOf('year').format('YYYY-MM-DD HH:mm:ss'),
      end: dayjs().endOf('year').format('YYYY-MM-DD HH:mm:ss'),
    }).then((res) => {
      console.log('res', res);
      if (res?.code === 200) {
        const result = [
          ...new Set([
            ...res?.data
              ?.filter((n) => n.bookDateTime)
              .map((n) => dayjs(n.bookDateTime).format('YYYY-MM-DD HH')),
          ]),
        ];
        console.log(result);
        setInvalidTimes(result || []);
      }
    });
    _otherFormList.forEach(async (item) => {
      if (item.prop === 'petStoreId') {
        const { data } = await storeList();
        console.log(data, 'data');
        item.options = data.map((n) => ({
          label: n.name,
          value: n.id,
        }));
      }
    });
    _setOtherFormList(_otherFormList);
  }, []);
  const handleSubmit = () => {
    const baseInfo = baseInfoRef.current?.getFormValues() || {};
    const otherInfo = otherInfoRef.current?.getFormValues() || {};
    console.log('handleSubmit', baseInfo, otherInfo);
    if (!baseInfo?.username) {
      return toast('联系人不为空');
    } else if (!baseInfo?.phone || !regexObj.phone.test(baseInfo.phone)) {
      return toast('请输入正确的手机号');
    } else if (!baseInfo?.petname) {
      return toast('爱宠名字不为空');
    } else if (!baseInfo?.type) {
      return toast('爱宠类型不为空');
    }
    if (isMenuA) {
      //A套餐
      // if (otherInfo.isSelfExpress === '1') {
      //   if (!otherInfo.petStoreId) {
      //     return toast('请选择宠物门店');
      //   }
      // }
    } else {
      if (!otherInfo?.bookDateTime) {
        return toast('上门服务时间不为空');
      } else if (otherInfo.isRite === '1' && !otherInfo.riteDateTime) {
        return toast('预约仪式日期不为空');
      } else if (
        ['2'].includes(otherInfo?.handleWay) &&
        !otherInfo?.handleDateTime
      ) {
        return toast('纪念物获取时间不为空');
      }
    }
    if (otherInfo.expressWay === '2') {
      if (!otherInfo.petStoreId) {
        return toast('请选择宠物门店');
      }
    } else if (otherInfo.expressWay === '3') {
      if (!otherInfo.handleDateTime) {
        return toast('请选择上门收取时间');
      }
      if (!otherInfo?.postAddress || !otherInfo?.detail) {
        return toast('接收地址不完整（包含门牌号）');
      }
    }

    if (!agreement) {
      return toast('请勾选用户购买套餐协议');
    }

    //添加数据到缓存
    setStorageSync('bookInfo', {
      ...otherInfo,
      ...baseInfo,
      isRite: otherInfo.isRite ? +otherInfo.isRite : undefined,
      handleWay: otherInfo.handleWay ? +otherInfo.handleWay : undefined,
      bookDateTime: otherInfo.bookDateTime
        ? new Date(otherInfo.bookDateTime)
        : undefined,
      riteDateTime: otherInfo.riteDateTime
        ? new Date(otherInfo.riteDateTime)
        : undefined,
      handleDateTime: otherInfo.handleDateTime
        ? new Date(otherInfo.handleDateTime)
        : undefined,
      // isSelfExpress: +otherInfo.isSelfExpress,
      expressWay: +otherInfo.expressWay,
      expressDateTime: otherInfo.expressDateTime
        ? new Date(otherInfo.expressDateTime)
        : undefined,
    });
    navigateTo({
      url: './additionalService/index',
    });
  };

  const handleAgreementChange = (e) => {
    setAggreement(e.detail.value);
  };
  const handleRiteChange = (val) => {
    console.log('handleRiteChangex--------46', val);
  };

  const handleFormDataChange = (propName: string, val: any) => {
    console.log('handleFormDataChange+411', val, propName);
    const checkProps = [
      'handleWay',
      'handleDateTime',
      'bookDateTime',
      'isRite',
      'riteDateTime',
      'handleWayCheck',
      'postAddress',
      'detail',
    ];
    const { menuId, petname, type, subType } = val;
    const isMenuA = menuList.findIndex((n) => n.id === val.menuId) === 1;

    if (propName === 'menuId') {
      setIsMenuA(isMenuA);

      _otherFormList.forEach((item: any) => {
        if (item.prop === 'handleWayCheck') {
          console.log('当前handleWay的值', formModel.handleWay);
          item.hidden = formModel.handleWay !== '3';
        } else {
          item.hidden = checkProps.includes(item.prop) && isMenuA;
        }
        if (
          [
            'petStoreId',
            'postAddress',
            'detail',
            'province',
            'city',
            'detail',
            'area',
            'expressDateTime',
          ].includes(item.prop)
        ) {
          item.hidden = true;
        }
        if (!isMenuA) {
          // if (item.prop === 'petStoreId') {
          //   item.hidden = false;
          // }
          if (item.prop === 'postAddress' || item.prop === 'detail') {
            item.hidden = true;
          }
        }
      });
      if (isMenuA) {
        setformModel({
          ...val,
          handleDateTime: undefined,
          bookDateTime: undefined,
          riteDateTime: undefined,
          isRite: undefined,
          handleWay: undefined,
          expressDateTime: undefined,
          isSelfExpress: '1',
          petStoreId: '',
          postAddress: '',
          detail: '',
          expressWay: '1',
        });
      } else {
        setformModel((d) => {
          return {
            ...d,
            ...val,
            menuId,
            petname,
            type,
            subType,
            handleWay: '2',
            isRite: '1',
            expressWay: '1',
          };
        });
      }

      getExpressOptions(val.menuId);
    } else if (propName === 'isRite') {
      _otherFormList.find((item) => item.prop === 'riteDateTime').hidden =
        val.isRite === '2';
      setformModel({
        ...val,
        riteDateTime: val.isRite === '2' ? undefined : val.riteDateTime,
      });
    } else if (propName === 'handleWay') {
      console.log('handlWay411', val.handleWay);
      _otherFormList.find((item) => item.prop === 'handleDateTime').hidden =
        val.handleWay === '1' || val.handleWay === '3';
      _otherFormList.find((item) => item.prop === 'handleWayCheck').hidden =
        val.handleWay !== '3';
      setformModel({
        ...val,
        handleDateTime: val.handleWay === '3' ? undefined : val.handleDateTime,
      });
    } else if (propName === 'expressWay') {
      const model = {};
      _otherFormList.forEach((item: any) => {
        if (val?.expressWay === '1') {
          if (item.prop === 'expressAddress') {
            item.hidden = false;
          }
          if (
            ['petStoreId', 'postAddress', 'detail', 'expressDateTime'].includes(
              item.prop
            )
          ) {
            item.hidden = true;
            model['petStoreId'] = '';
            model['postAddress'] = '';
            model['detail'] = '';
            model['expressDateTime'] = '';
          }
        } else if (val?.expressWay === '2') {
          if (item.prop === 'petStoreId') {
            item.hidden = false;
          }
          if (
            [
              'postAddress',
              'detail',
              'expressAddress',
              'expressDateTime',
            ].includes(item.prop)
          ) {
            item.hidden = true;
            model['postAddress'] = '';
            model['detail'] = '';
            model['expressDateTime'] = '';
          }
        } else if (val?.expressWay === '3') {
          if (
            item.prop === 'postAddress' ||
            item.prop === 'detail' ||
            item.prop === 'expressDateTime'
          ) {
            item.hidden = false;
          }
          if (item.prop === 'expressAddress' || item.prop === 'petStoreId') {
            item.hidden = true;
            model['petStoreId'] = '';
          }
        }
      });
      setformModel((d) => {
        return {
          ...d,
          ...val,
          ...model,
        };
      });
    } else if (propName === 'location') {
      console.log('formData411在location', formModel);
      setformModel({
        ...formModel,
        ...val,
      });
    } else if (propName === 'mark' || propName === 'petStoreId') {
      setformModel({
        ...val,
      });
    } else if (propName === 'petPicker') {
      console.log(val, formModel, '宠物选择');
      setformModel({
        ...formModel,
        ...val,
      });
    } else {
      // console.log('handleFormDataChange41111++', val);
      setformModel(val);
    }
  };

  useEffect(() => {
    console.log('menuList变更411');
    const showProps = [
      'handleWay',
      'handleDateTime',
      'bookDateTime',
      'isRite',
      'riteDateTime',
    ];
    _otherFormList.forEach((item: any) => {
      if (item.prop === 'postAddress' || item.prop === 'detail') {
        // item.hidden = formModel.isSelfExpress === '1';
      }
      if (item.prop === 'menuId') {
        item.tabsOptions = menuList.map((item: any) => ({
          id: item.id,
          label: item.name,
          content: item.description,
        }));
        item.tabsTitle = menuList.map((iten: any) => iten.name);
      }
      //重置
      if (showProps.includes(item.prop) && item.hidden === undefined) {
        item.hidden = false;
      }
    });
    getExpressOptions(menuList[0]?.id);
  }, [menuList]);

  const endDate = new Date(dayjs().endOf('year').format('YYYY-MM-DD'));
  const [renderKey, setRenderKey] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');
  const [defaultDate, setDefaultDate] = useState({
    startDate: new Date(dayjs().year(), dayjs().month(), dayjs().date()),
    bookDateTime: '',
    endDate: endDate,
    timeRange: [],
    propName: '',
    pickerTitle: '日期选择',
    //currentDate: new Date(),
  });
  const [currentDate, setCurrentDate] = useState(new Date());
  const [validTimesRange, setValidTimesRange] = useState<string[]>([]);

  const filterAvailableRanges = (times: string[]) => {
    return times?.filter((slot) => {
      // 将时间段转换为今天的日期时间对象
      const slotTime = dayjs().set('hour', parseInt(slot));
      // 比较时间段是否在当前时间之后
      return slotTime.isAfter(dayjs());
    });
  };

  const handlePickerClick = (formItem, formData) => {
    console.log('pickerClick410', formItem, formData);

    defaultDate.propName = formItem.prop;
    // dateInfo.timeRange = formItem.timeRange;
    // selectedTime?.split(' ')[1] ||
    //设置可选时间范围
    let bookDateTimeHour = 0;
    if (formItem.prop === 'bookDateTime') {
      console.log('410handleDateChange', validTimesRange);

      defaultDate.pickerTitle = '请选择上门服务时间';
    } else {
      const titleObj = {
        riteDateTime: '请选择预约仪式时间',
        handleDateTime: '请选择纪念物收取时间',
        expressDateTime: '请选择上门收取时间',
      };

      defaultDate.pickerTitle = titleObj[formItem.prop];
      bookDateTimeHour = dayjs(formData.bookDateTime).hour();
      console.log('410handleDateChangexxx', formData, bookDateTimeHour);
    }

    //筛选掉不可用日期
    // .filter(
    //   (n: string) =>
    //     !invalidTimes.includes(n) && n > bookDateTimeHour.toString()
    // )
    console.log(
      '410handleDateChangexxx',
      formItem.timeRange,
      formItem.timeRange.filter((n) => n > (bookDateTimeHour || 0))
    );
    setValidTimesRange(() =>
      filterAvailableRanges(
        formItem.timeRange.filter((n) => n > (bookDateTimeHour || 0))
      )
    );
    setTimeout(() => {
      setShowDatePicker(true);
    }, 100);
  };

  useEffect(() => {
    // setRenderKey(+new Date());
  }, [currentDate]);

  const handleConfirm = (values, options) => {
    console.log(
      '411handleConfirm',
      invalidTimes,
      values,
      options,
      defaultDate.propName
    );

    const selectTime = `${values[0]}-${values[1]}-${values[2]} ${values[3]}`;
    const lastItem = options[options.length - 1];
    if (options?.some((o) => o.disabled)) {
      if (lastItem?.isDisabled) {
        return showToast({
          title: '该时间段不可选!',
          icon: 'none',
        });
      } else {
        return showToast({
          title: '置灰时间段不可选!',
          icon: 'none',
        });
      }
    }
    setformModel({
      ...formModel,
      ...(defaultDate.propName === 'bookDateTime'
        ? {
            riteDateTime: '',
            handleDateTime: '',
            expressDateTime: '',
          }
        : {}),
      [defaultDate.propName]: selectTime + ':00',
    });
    setShowDatePicker(false);
  };

  const handleDateChange = (options, value, index) => {
    const getSelectTime = `${value[0]}-${value[1]}-${value[2]}`;
    const month = dayjs().month() + 1;
    const day = dayjs().date();
    //判断change后的时间不是当前时间
    if (index !== 3 && index !== 0) {
      //  const cloneTimeRange = [...validTimesRange];
      // console.log('410cloneTimeRange', cloneTimeRange);
      console.log('410handleDateChangecwl', month, day, value[2], value[1]);

      if (value[1] < month || value[2] < day) {
        setValidTimesRange(() => []);
        // obj[defaultDate.propName]
      } else if (value[1] == month && value[2] == day) {
        console.log(obj['bookDateTime'], '410handleDateChangecwlxxxx');
        setValidTimesRange(() =>
          filterAvailableRanges(obj[defaultDate.propName])
        );
      } else {
        // 还原
        const bookDateTime = dayjs(formModel['bookDateTime']).hour();
        console.log(obj[defaultDate.propName], '410handleDateChangecwlxxxx');

        setValidTimesRange(() => obj[defaultDate.propName]);
      }
    }
    setSelectedTime(() => getSelectTime);
    setCurrentDate(
     () => new Date(`${value[0]}/${value[1]}/${value[2]} ${obj[defaultDate.propName][0]}:00:00`)
    );
    
  };

  const handleFilter = (type, option) => {
    if (type === 'hour') {
      return option.filter((n) => n.isShow);
    }
    if (type === 'year') {
      return option.filter((n) => n.isShow);
    }
    return option;
  };

  return (
    <Suspense fallback={<AtToast isOpened text="loading"></AtToast>}>
      <View className="pt-20 page-createBox">
        <View className="formCon">
          <AddForm
            ref={baseInfoRef}
            formList={_baseInfoFormList}
            formModel={formModel}
            onFormChange={handleFormDataChange}
          ></AddForm>
        </View>
        <View className="formCon">
          <AddForm
            ref={otherInfoRef}
            formList={_otherFormList}
            formModel={formModel}
            onFormChange={handleFormDataChange}
            onPickerClick={handlePickerClick}
          >
            {{
              handleRiteChange,
            }}
          </AddForm>
        </View>
        {/* 协议 */}
        <View className="flex justify-center mb-30">
          <CheckboxGroup onChange={handleAgreementChange}>
            <Label className="checkboxLabel">
              <Checkbox className="checkbox" value="agree" color="#004ebf" />
              <Text className="txt">用户服务协议</Text>
            </Label>
          </CheckboxGroup>
        </View>

        <View className="flex btnList">
          <AtButton
            className="flex-1 btn"
            onClick={handleSubmit}
            type="primary"
          >
            下一步
          </AtButton>
        </View>
      </View>

      <DatePicker
        title={defaultDate.pickerTitle}
        // startDate={defaultDate.startDate}
        endDate={defaultDate.endDate}
        visible={showDatePicker}
        type="datehour"
        // key={renderKey}
        formatter={(type: string, option: PickerOption) => {
          // console.log('410handleDateChange', type, option);
          const ymd =
            selectedTime?.split(' ')[0] ||
            dayjs(currentDate).format('YYYY-MM-DD');
          const selectMonth = dayjs(ymd).month();
          if (type == 'month') {
            const isDisabled = option.value < dayjs().month() + 1;
            return {
              label: (
                <View className={`${isDisabled ? 'disabled' : ''}`}>
                  {option.label}
                </View>
              ),
              value: option.value,
              disabled: isDisabled,
            };
          }
          // console.log('year', dayjs().year(), option.value);
          if (type == 'year') {
            return {
              label: <View>{option.label}</View>,
              value: option.value,
              isShow: option.value == dayjs().year(),
            };
          }
          if (type == 'day') {
            const isDisabled =
              selectMonth == dayjs().month() && option.value < dayjs().date();
            return {
              label: (
                <View className={`${isDisabled ? 'disabled' : ''}`}>
                  {option.label}
                </View>
              ),
              value: option.value,
              disabled: isDisabled,
            };
          }
          if (type === 'hour') {
            const filteredTimes = invalidTimes.filter((i) => i.includes(ymd));
            return {
              label: (
                <View
                  className={`${
                    filteredTimes?.includes(option.value as string)
                      ? 'disabled'
                      : ''
                  }`}
                  style={{
                    fontSize: '20px',
                  }}
                >
                  {option.label}:00
                </View>
              ),
              value: `${option.value}`,
              isShow: validTimesRange?.includes(option.value as string),
              disabled: filteredTimes.includes(option.value as string),
            };
          }
        }}
        // defaultValue={defaultDate.startDate}
        filter={(type, option) => handleFilter(type, option)}
        value={currentDate}
        onChange={handleDateChange}
        onCancel={() => setShowDatePicker(false)}
        onConfirm={(options, values) => handleConfirm(values, options)}
      />
    </Suspense>
  );
};
