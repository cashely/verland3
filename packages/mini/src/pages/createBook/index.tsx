import { useState, useRef, useEffect, Suspense } from 'react';
import { View, Label, Checkbox, Text, CheckboxGroup } from '@tarojs/components';
import { useLoad, showToast, navigateTo, setStorageSync } from '@tarojs/taro';
import { AtButton, AtToast, AtActionSheet } from 'taro-ui';
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
import { DatePicker } from '@nutui/nutui-react-taro';

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
  const [invalidTimes, setInvalidTimes] = useState([]);
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
    console.log('handleFormDataChange+46', val, propName);
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
    } else if (propName === 'handleWay') {
      _otherFormList.forEach((item: any) => {
        if (item.prop === 'handleWayCheck') {
          item.hidden = val.handleWay !== '3';
        } else if (item.prop === 'handleDateTime') {
          item.hidden = val.handleWay === '1' || val.handleWay === '3';
        }
      });

      _setOtherFormList(_otherFormList);
    } else if (propName === 'isSelfExpress') {
      //清空
      _otherFormList.forEach((item: any) => {
        if (isMenuA) {
          if (item.prop === 'postAddress' || item.prop === 'detail') {
            item.hidden = true;
          }
        }
        //B套餐
        if (val?.isSelfExpress === '1') {
          if (item.prop === 'petStoreId') {
            item.hidden = false;
          }
          if (item.prop === 'postAddress' || item.prop === 'detail') {
            item.hidden = true;
          }
        } else {
          if (item.prop === 'petStoreId') {
            item.hidden = true;
          }
          if (item.prop === 'postAddress' || item.prop === 'detail') {
            item.hidden = false;
          }
        }

        // if (item.prop === 'petStoreId') {
        //   item.hidden = val.isSelfExpress === '2';
        // }
      });

      setformModel((d) => {
        return {
          ...d,
          ...val,
          postAddress: '',
          province: '',
          city: '',
          area: '',
          detail: '',
          petStoreId: '',
        };
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
    } else {
      setformModel((d) => {
        return {
          ...d,
          ...val,
        };
      });
    }
    // else if (propName === 'isSelfExpress') {
    //   setformModel((d) => {
    //     return {
    //       ...d,
    //       ...val,
    //     };
    //   });
    // }
    // else {
    //   console.log('handleFormDataChange++', val);
    //   setformModel((d) => {
    //     return {
    //       ...d,
    //       menuId,
    //       petname,
    //       type,
    //       subType,
    //     };
    //   });
    // }
  };

  useEffect(() => {
    console.log('menuList变更46');
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
    // _setOtherFormList((d: any) => {
    //   console.log('setOtherFormList', d, menuList);
    //   return d.map((item: any) => {
    //     if (item.prop === 'menuId') {
    //       return {
    //         ...item,
    //         tabsOptions: menuList.map((item: any) => ({
    //           id: item.id,
    //           label: item.name,
    //           content: item.description,
    //         })),
    //         tabsTitle: menuList.map((iten: any) => iten.name),
    //       };
    //     }
    //     return item;
    //   });
    // });

    // setformModel((d: any) => {
    //   return {
    //     ...d,
    //     isRite: '1',
    //     handleWay: '2',
    //   };
    // });
  }, [menuList]);

  // useUnload(() => {
  //   console.log('卸载====');
  //   setformModel({
  //     ...formModel,
  //     menuId: '', // 处理方式
  //   });
  // });

  const handleFilterTimes = (propName: string, val: any, formData: any) => {
    if (propName === 'bookDateTime') {
      console.log(
        'formDatabookDateTime47',
        val,
        dayjs(formData.bookDateTime).date(),
        dayjs().date()
      );
      const bookDateHour = val.split(' ')[1].split(':')[0];
      _otherFormList.forEach((item: any) => {
        if (item.prop === 'riteDateTime') {
          // item.minDate = {
          //   month: dayjs(formData.bookDateTime).month(),
          //   day: dayjs(formData.bookDateTime).date(),
          // };
          console.log('item.formDatabookDateTime47', item.minDate);
          // if (item.minDate.day === dayjs().date()) {
          item.timeRange = RITE_SERVICE_TIME_RANGES.filter((iten: any) => {
            return iten.split(':')[0] > bookDateHour;
          });
          // } else {
          //   item.timeRange = RITE_SERVICE_TIME_RANGES;
          // }
        }
        if (item.prop === 'handleDateTime') {
          console.log('当前被打开的表单项', item);
          // item.minDate = {
          //   month: dayjs(formData.bookDateTime).month(),
          //   day: dayjs(formData.bookDateTime).date(),
          // };
          item.timeRange = SERVICE_TIME_RANGES.filter((iten: any) => {
            return iten.split(':')[0] > bookDateHour;
          });
        }
        formData.riteDateTime = '';
        formData.handleDateTime = '';
      });
      console.log('_otherFormList', _otherFormList);
      _setOtherFormList(_otherFormList);
    }
  };

  const handleDatePickerColumnChange = (
    propName: string,
    val: any,
    setAvailableRanges: any,
    selectedTime: string,
    formData: any
  ) => {
    console.log('handleDatePickerColumnChange49', propName, val, selectedTime);
    if (propName === 'riteDateTime') {
      console.log(
        'handleDatePickerColumnChange47',
        val,
        selectedTime,
        dayjs().format('YYYY-MM-DD'),
        formData.bookDateTime
      );
      const curTimeForHour = formData.bookDateTime.split(' ')[1].split(':')[0];
      if (selectedTime === dayjs(formData.bookDateTime)?.format('YYYY-MM-DD')) {
        setAvailableRanges(
          RITE_SERVICE_TIME_RANGES.filter(
            (n) => n.split(':')[0] > curTimeForHour && n !== curTimeForHour
          )
        );
      } else {
        setAvailableRanges(
          RITE_SERVICE_TIME_RANGES.filter((n) => n !== curTimeForHour)
        );
      }
    } else if (propName === 'handleDateTime') {
      const curTimeForHour = formData.bookDateTime.split(' ')[1].split(':')[0];
      console.log(
        'curTimeForHour',
        curTimeForHour,
        'selectedTime',
        selectedTime
      );

      if (selectedTime === dayjs(formData.bookDateTime)?.format('YYYY-MM-DD')) {
        setAvailableRanges(
          SERVICE_TIME_RANGES.filter(
            (n) => n.split(':')[0] > curTimeForHour && n !== curTimeForHour
          )
        );
      } else {
        setAvailableRanges(
          SERVICE_TIME_RANGES.filter((n) => n !== curTimeForHour)
        );
      }
    }
  };

  // const [dateInfo, setDateInfo] = useState({
  //   supportAll: false,
  //   propName: '',
  //   timeRange: [],
  //   minDate: {
  //     day: new Date().getDate(),
  //   },
  // });

  //pickerCloumn更改回调
  // const handleDatePickerColumn = ({
  //   propName,
  //   value,
  //   setAvailableRanges,
  //   selectedTime,
  // }) => {
  //   console.log('选择日期的值', propName, value);
  //   // setFormData({
  //   //   ...formData,
  //   //   [formProp]: value,
  //   // });
  //   // props.onDatePickColumnChange &&
  //   //   props.onDatePickColumnChange(
  //   //     propName,
  //   //     value,
  //   //     setAvailableRanges,
  //   //     selectedTime,
  //   //     formData
  //   //   );
  // };
  const endDate = new Date(dayjs().endOf('year').format('YYYY-MM-DD'));
  const [renderKey, setRenderKey] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(false);
  // const [timeRange, setTimeRange] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [defaultDate, setDefaultDate] = useState({
    // year: dayjs().year(),
    // month: dayjs().month(),
    // day: dayjs().date(),
    startDate: new Date(dayjs().year(), dayjs().month(), dayjs().date()),
    bookDateTime: '',
    endDate: endDate,
    timeRange: [],
    propName: '',
    hour: '0',
    currentDate: new Date(),
  });
  const handleFilter = (type: string, option: PickerOptions) => {
    console.log('410filter', type, option);

    if (type === 'hour') {
      console.log('410hour', defaultDate.timeRange);
      return defaultDate.timeRange.map((item) => ({
        label: item,
        value: item,
      }));
    }
    // if (type === 'month') {
    //   return option.filter((item) => item.value >= dayjs().month() + 1);
    // }
    if (type === 'day') {
      console.log('day', option, selectedTime);
      // const selectedMonth = dayjs(selectedTime).month() + 1;
      // const curMonth = dayjs().month() + 1;
      //  option.filter((item) => {
      //   if (selectedMonth === curMonth) {
      //     return item.value >= dayjs().date();
      //   } else {
      //     return item;
      //   }
      // });
      return option;
    }

    return option;
  };

  const filterAvailableRanges = (times: string[]) => {
    return times?.filter((slot) => {
      // 将时间段转换为今天的日期时间对象
      const slotTime = dayjs().set('hour', parseInt(slot));
      // 比较时间段是否在当前时间之后
      return slotTime.isAfter(dayjs());
    });
  };

  useEffect(() => {
    console.log('410timeRange', defaultDate.timeRange);
    // const hour = +timeRange[0];
    // setDefaultDate({
    //   ...defaultDate,
    //   startDate: new Date(
    //     dayjs().year(),
    //     dayjs().month(),
    //     dayjs().date(),
    //     hour
    //   ),
    // });
    //
    // setRenderKey(+new Date());
    // setDefaultDate(defaultDate);
  }, [defaultDate.timeRange, defaultDate.propName]);

  const handlePickerClick = (formItem, formData) => {
    console.log('pickerClick410', formItem, formData);

    defaultDate.propName = formItem.prop;
    // dateInfo.timeRange = formItem.timeRange;
    // selectedTime?.split(' ')[1] ||
    //设置可选时间范围
    /*
    if (formItem.prop === 'bookDateTime') {
      setDefaultDate((d) => {
        d.timeRange = filterAvailableRanges(formItem.timeRange);
        d.bookDateTime = formData.bookDateTime;
        d.startDate = new Date(
          dayjs(formData.bookDateTime).year(),
          dayjs(formData.bookDateTime).month(),
          dayjs(formData.bookDateTime).date(),
          parseInt(d.timeRange[0])
        );
        return d;
      });
    }
    if (formItem.prop === 'riteDateTime') {
      //筛选掉不可用日期
      console.log(
        '410riteDateTime----------------------------',
        formItem,
        filterAvailableRanges(formItem.timeRange),
        formData.bookDateTime?.split(' ')[1]?.split(':')[0]
      );
      setDefaultDate((d) => {
        d.timeRange = filterAvailableRanges(formItem.timeRange) as [];
        const hour = parseInt(
          formData.bookDateTime?.split(' ')[1]?.split(':')[0]
        );
        console.log(
          '410sadfasfklsjaklfjaklsjfkjsakdfjklsajdfklasd',
          d.timeRange.includes(hour) ? hour : d.timeRange[0]
        );
        d.startDate = new Date(
          dayjs().year(),
          dayjs().month(),
          dayjs().date(),
          parseInt(d.timeRange.includes(hour) ? hour : d.timeRange[0])
        );
        /*
        d.currentDate = new Date(
          dayjs(formData.bookDateTime).year(),
          dayjs(formData.bookDateTime).month(),
          dayjs(formData.bookDateTime).date(),
          parseInt()
        );

        return d;
      });
    }
  */
    setShowDatePicker(true);
  };

  useEffect(() => {
    if (showDatePicker) {
      console.log('410-timeRange', defaultDate.timeRange);
      setDefaultDate(defaultDate);
    }
  }, [showDatePicker, defaultDate]);

  // function getDaysInMonth(year, month) {
  //   console.log(dayjs(`${year}-${month}-01`).endOf('month').date());
  //   return dayjs(`${year}-${month}-01`).endOf('month').date();
  // }

  const handleConfirm = (values, options) => {
    const selectTime = `${values[0]}-${values[1]}-${values[2]} ${values[3]}`;
    console.log(
      '410handleConfirm',
      invalidTimes,
      values,
      options,
      defaultDate.propName,
      selectTime
    );
    setSelectedTime(selectTime);
    if (invalidTimes.includes(selectTime)) {
      showToast({
        title: '该时间段已被预约',
        icon: 'none',
      });
      return;
    }
    //判断时间是否已经被预约

    setformModel({
      ...formModel,
      [defaultDate.propName]: selectTime + ':00',
    });
  };

  // useEffect(() => {
  //   if (dayjs(selectedTime).isBefore(dayjs(), 'day')) {
  //     showToast({
  //       title: '请选择今天及以后的日期',
  //       icon: 'none',
  //     });
  //     return;
  //   }
  // }, [selectedTime]);

  const handleDateChange = (options, value, index) => {
    console.log(
      '410handleDateChange+++++++++++++++++++++++++++',
      options,
      value,
      index,
      defaultDate.propName
    );

    const getSelectTime = `${value[0]}-${value[1]}-${value[2]}`;
    const month = dayjs().month() + 1;
    const day = dayjs().date();
    setSelectedTime(getSelectTime);
    //判断change后的时间不是当前时间
    /*
    if (index !== 3 && index !== 0) {
      console.log(
        day,
        month,
        value[1],
        value[2],
        '410qqqqqqqqqqqqqqqqqqqqqq',
        filterAvailableRanges(obj[defaultDate.propName])
      );
      if (month != value[1] || day != value[2]) {
        defaultDate.timeRange = obj[defaultDate.propName];
      } else if (day == value[2]) {
        console.log(
          filterAvailableRanges(obj[defaultDate.propName]),
          '410_____________________________________________'
        );
        defaultDate.timeRange = filterAvailableRanges(
          obj[defaultDate.propName]
        );
      }
    }*/
    // if (dayjs(getSelectTime).isBefore(dayjs(), 'day')) {
    //   showToast({
    //     title: '请选择今天及以后的日期',
    //     icon: 'none',
    //   });
    //   return;

    // defaultDate.startDate = new Date(
    //   value[0],
    //   month,
    //   day,
    //   parseInt(defaultDate.timeRange[0])
    // );
    // }
    // setformModel
    // setTimeRange(filterAvailableRanges(dateInfo.timeRange));

    // setformModel({
    //   ...formModel,
    //   [dateInfo.propName]: value,
    // });
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
            invalidTimes={invalidTimes}
            filterTimes={handleFilterTimes}
            onDatePickColumnChange={handleDatePickerColumnChange}
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

      {/* 日期时间组件 */}
      {/* <DateTimePicker
        isOpened={showDatePicker}
        invalidTimes={invalidTimes}
        data={dateInfo}
        onConfirm={handleDateTimeConfirm}
        onClose={handleCloseDateTimePicker}
        onDatePickerChange={handleDatePickChange}
        // onMonthChange={handleMonthChange}
      >
        <Text>slot</Text>
      </DateTimePicker> */}

      <DatePicker
        title="日期时间选择"
        startDate={defaultDate.startDate}
        endDate={defaultDate.endDate}
        visible={showDatePicker}
        type="datehour"
        defaultValue={defaultDate.startDate}
        filter={(type, option) => handleFilter(type, option)}
        // value={
        //   new Date(
        //     defaultDate.year,
        //     defaultDate.month,
        //     defaultDate.day,
        //     defaultDate.hour
        //   )
        // }
        onChange={handleDateChange}
        onCancel={() => setShowDatePicker(false)}
        onClose={() => setShowDatePicker(false)}
        // filter={filter}
        onConfirm={(options, values) => handleConfirm(values, options)}
      />
    </Suspense>
  );
};
