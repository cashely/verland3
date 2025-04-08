import { useState, useRef, useEffect, Suspense } from 'react';
import { View, Label, Checkbox, Text, CheckboxGroup } from '@tarojs/components';
import {
  useLoad,
  showToast,
  navigateTo,
  useUnload,
  setStorageSync,
} from '@tarojs/taro';
import { AtButton, AtToast } from 'taro-ui';
import { otherFormList, baseInfoFormList } from './model';
import AddForm from '@/components/AddForm';
import { PET_SUBTYPES, RITE_SERVICE_TIME_RANGES } from '@/constants';
import regexObj from '@/utils/regexObj';
//import AppContext from '@/hooks/useContext';
import { storeList } from '@/apis/pet';
import { menu } from '@/apis/common';
import dayjs from 'dayjs';
import './index.scss';

export default () => {
  const baseInfoRef = useRef(null);
  const otherInfoRef = useRef(null);
  const [agreement, setAggreement] = useState('');
  const [menuList, setMenuList] = useState([]);
  const [isMenuA, setIsMenuA] = useState(false);
  const [formModel, setformModel] = useState({
    isRite: '1',
    handleWay: '2',
    isSelfExpress: '1',
  });
  useLoad(() => {
    console.log('Page loaded.');
    _setOtherFormList(otherFormList);
  });
  const [_otherFormList, _setOtherFormList] = useState(otherFormList);
  const [_baseInfoFormList, _setBaseInfoFormList] = useState(baseInfoFormList);
  const toast = (text: string) => {
    showToast({
      title: text,
      icon: 'none',
    });
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
        setMenuList(res?.data || []);
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
    if (otherInfo.isSelfExpress === '1') {
      if (!otherInfo.petStoreId) {
        return toast('请选择宠物门店');
      }
    } else {
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
      isSelfExpress: +otherInfo.isSelfExpress,
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
        // if (!isMenuA) {
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
        // }
      });
      if (isMenuA) {
        setformModel({
          ...val,
          isRite: undefined,
          handleWay: undefined,
          isSelfExpress: '1',
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
            isSelfExpress: '1',
          };
        });
      }

      _setOtherFormList(_otherFormList);
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
        item.hidden = formModel.isSelfExpress === '1';
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
      if (showProps.includes(item.prop)) {
        item.hidden = false;
      }
    });
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
          item.minDate = {
            month: dayjs(formData.bookDateTime).month(),
            day: dayjs(formData.bookDateTime).date(),
          };
          console.log('item.formDatabookDateTime47', item.minDate);
          // if (item.minDate.day === dayjs().date()) {
          item.timeRange = RITE_SERVICE_TIME_RANGES.filter((iten: any) => {
            return iten.split(':')[0] > bookDateHour;
          });
          // } else {
          //   item.timeRange = RITE_SERVICE_TIME_RANGES;
          // }
        }
        formData.riteDateTime = '';
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
        console.log(_otherFormList, val, '++)))))))');
      }
    }
  };

  const handlePickerClick = (formItem: any, formData: any) => {
    console.log('handlePickerClick', formItem, formData);
    if (formItem.prop === 'petStoreId') {
    }
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
    </Suspense>
  );
};
