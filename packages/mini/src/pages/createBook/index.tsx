import { useState, useRef, useEffect, Suspense } from 'react';
import { View, Label, Checkbox, Text, CheckboxGroup } from '@tarojs/components';
import { useLoad, showToast, navigateTo, setStorageSync } from '@tarojs/taro';
import { AtButton, AtToast } from 'taro-ui';
import { otherFormList, baseInfoFormList } from './model';
import AddForm from '@/components/AddForm';
import { RITE_SERVICE_TIME_RANGES, SERVICE_TIME_RANGES } from '@/constants';
//import AppContext from '@/hooks/useContext';
import { menu } from '@/apis/common';
import dayjs from 'dayjs';
import './index.scss';

export default () => {
  const baseInfoRef = useRef(null);
  const otherInfoRef = useRef(null);
  const [agreement, setAggreement] = useState('');
  const [menuList, setMenuList] = useState([]);
  const [isMenuA, setIsMenuA] = useState(false);
  const [formModel, setformModel] = useState({});
  useLoad(() => {
    console.log('Page loaded.');
  });
  const [_otherFormList, _setOtherFormList] = useState(otherFormList);
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
  }, []);
  const handleSubmit = () => {
    const baseInfo = baseInfoRef.current?.getFormValues() || {};
    const otherInfo = otherInfoRef.current?.getFormValues() || {};
    console.log('handleSubmit', baseInfo, otherInfo);
    // if (!baseInfo?.username) {
    //   return toast('联系人不为空');
    // } else if (!baseInfo?.phone || !regexObj.phone.test(baseInfo.phone)) {
    //   return toast('请输入正确的手机号');
    // }
    if (!baseInfo?.petname) {
      return toast('爱宠名字不为空');
    } else if (!baseInfo?.type) {
      return toast('爱宠类型不为空');
    }
    if (isMenuA) {
      //A套餐
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
      if (!otherInfo?.postAddress || !otherInfo?.detail) {
        return toast('接收地址不完整（包含门牌号）');
      }
    }

    if (!agreement) {
      return toast('请勾选用户购买套餐协议');
    }

    //添加数据到缓存
    setStorageSync('bookInfo', {
      ...baseInfo,
      ...otherInfo,
      type: baseInfo?.type?.split('/')[0],
      subType: baseInfo?.type?.split('/')[1],
      weight: baseInfo.weight,
      isRite: +otherInfo.isRite,
      handleWay: +otherInfo.handleWay,
      bookDateTime: new Date(otherInfo.bookDateTime),
      riteDateTime: new Date(otherInfo.riteDateTime),
      handleDateTime: new Date(otherInfo.handleDateTime),
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
      'detail',
      'postAddress',
      'handleWayCheck',
    ];
    if (propName === 'menuId') {
      setIsMenuA(() => {
        const isMenuA = menuList.findIndex((n) => n.id === val.menuId) === 1;
        const { menuId, petname, weight, type, subType } = formModel;
        console.log('选择了套餐A', isMenuA);
        _otherFormList.forEach((item: any) => {
          if (item.prop === 'handleWayCheck') {
            console.log('当前handleWay的值', formModel.handleWay);
            item.hidden = formModel.handleWay !== '3';
          } else {
            item.hidden = checkProps.includes(item.prop) && isMenuA;
          }
        });

        setformModel(
          Object.assign(
            {
              menuId,
              petname,
              weight,
              type,
              subType,
            },
            isMenuA ? {} : { handleWay: '2', isRite: '1' }
          )
        );
        return isMenuA;
      });
      _setOtherFormList(_otherFormList);
    } else if (propName === 'handleWay') {
      console.log('propNamehandleWay', val.handleWay);
      _otherFormList.forEach((item: any) => {
        if (item.prop === 'handleWayCheck') {
          item.hidden = val.handleWay !== '3';
        } else if (item.prop === 'handleDateTime') {
          item.hidden = val.handleWay === '1' || val.handleWay === '3';
        }
      });
      formModel.handleWayCheck = null;
      _setOtherFormList(_otherFormList);
    } else if (propName === 'bookDateTime') {
      console.log('propNamehandleDateTime', val);
    }

    console.log('item4666', formModel);
  };

  useEffect(() => {
    console.log('menuList变更46');
    _setOtherFormList((d: any) => {
      console.log('setOtherFormList', d, menuList);
      return d.map((item: any) => {
        if (item.prop === 'menuId') {
          return {
            ...item,
            tabsOptions: menuList.map((item: any) => ({
              id: item.id,
              label: item.name,
              content: item.description,
            })),
            tabsTitle: menuList.map((iten: any) => iten.name),
          };
        }
        return item;
      });
    });
    setformModel((d: any) => {
      return {
        ...d,
        isRite: '1',
        handleWay: '2',
      };
    });
  }, [menuList]);

  const handleFilterTimes = (propName: string, val: any, formData: any) => {
    if (propName === 'bookDateTime') {
      const curTime = val.split(' ')[1];
      console.log('formDatabookDateTime', dayjs(formData.bookDateTime).date());
      console.log('curTime', curTime.split(':')[0]);
      _otherFormList.forEach((item: any) => {
        if (item.prop === 'riteDateTime') {
          item.timeRange = RITE_SERVICE_TIME_RANGES.filter((iten: any) => {
            return iten.split(':')[0] > curTime.split(':')[0];
          });
          item.minDate = {
            month: dayjs(formData.bookDateTime).month(),
            day: dayjs(formData.bookDateTime).date(),
          };
        }
      });
      console.log('_otherFormList', _otherFormList);
      _setOtherFormList(_otherFormList);
    } else if (propName === 'riteDateTime') {
      console.log('handleDateTfasdfasime', formData.riteDateTime);
      //纪念物领取时间
      const riteTime = formData.riteDateTime.split(' ')[1].split(':')[0];
      _otherFormList.forEach((item: any) => {
        if (item.prop === 'handleDateTime') {
          item.timeRange = SERVICE_TIME_RANGES.filter((iten: any) => {
            return (
              iten.split(':')[0] > riteTime && iten.split(':')[0] !== riteTime
            );
          });
          item.minDate = {
            month: dayjs(formData.riteDateTime).month(),
            day: dayjs(formData.riteDateTime).date(),
          };
        }
      });
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
        'handleDatePickerColumnChange',
        val,
        selectedTime,
        dayjs().format('YYYY-MM-DD'),
        formData.bookDateTime
      );
      const curTimeForHour = formData.bookDateTime.split(' ')[1].split(':')[0];
      if (selectedTime === dayjs().format('YYYY-MM-DD')) {
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
  return (
    <Suspense fallback={<AtToast isOpened text="loading"></AtToast>}>
      <View className="pt-20 page-createBox">
        <View className="formCon">
          <AddForm
            ref={baseInfoRef}
            formList={baseInfoFormList}
            formModel={formModel}
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
