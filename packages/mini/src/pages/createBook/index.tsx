import { useState, useRef, useEffect, Suspense } from 'react';
import { View } from '@tarojs/components';
import {
  useLoad,
  showToast,
  navigateTo,
  setStorageSync,
  useUnload,
} from '@tarojs/taro';
import { AtButton, AtToast } from 'taro-ui';
import { otherFormList, baseInfoFormList } from './model';
import AddForm from '@/components/AddForm';
import { PET_RECEIVE_WAYS } from '@/constants';
import regexObj from '@/utils/regexObj';
//import AppContext from '@/hooks/useContext';
import { storeList } from '@/apis/pet';
import { isBooked } from '@/apis/book';
import { menu } from '@/apis/common';
import dayjs from 'dayjs';

import './index.scss';

export default () => {
  const baseInfoRef = useRef(null);
  const otherInfoRef = useRef(null);
  const [menuList, setMenuList] = useState([]);
  const [selectMenuItem, setSelectMenuItem] = useState({});
  const [formModel, setformModel] = useState({
    handleWay: '2',
    // expressWay: '1',
  });

  useLoad(() => {
    console.log('Page loaded.');
    _setOtherFormList(otherFormList);
  });
  const [_otherFormList, _setOtherFormList] = useState([...otherFormList]);
  const [_baseInfoFormList, _setBaseInfoFormList] = useState(baseInfoFormList);
  const [invalidTimes, setInvalidTimes] = useState<string[]>([]);
  const toast = (text: string) => {
    showToast({
      title: text,
      icon: 'none',
    });
  };

  const getExpressOptions = (menuId: string) => {
    const menuItem = menuList.find((o) => o.id === menuId);
    const wayIds = menuItem?.expressWays?.split(',') || [];

    setSelectMenuItem(menuItem || {});
    setformModel((d) => {
      d['isRite'] = menuItem?.isRite || undefined;
      d.expressWay = wayIds[0] || null;
      return d;
    });
    console.log(wayIds, 'wayIds');
    _otherFormList.forEach((item) => {
      if (item.prop === 'bookDateTime') {
        item.hidden = true;
      }
      if (item.prop === 'isRite' || item.prop === 'riteDateTime') {
        item.hidden = menuItem?.isRite === 2;
      }
      if (item.prop === 'expressWay') {
        item.options = PET_RECEIVE_WAYS.filter((o) =>
          wayIds?.includes(o.value)
        );
        item.hidden = !wayIds?.length;
      }
      if (menuItem?.expressWays && item.prop === 'expressAddress') {
        console.log(menuItem, '422');
        item.hidden = ['2', '3'].includes(wayIds[0]);
      }
      //门店接收显示
      if (item.prop === 'petStoreId' && menuItem?.expressWays) {
        item.hidden = ['1', '3'].includes(wayIds[0]);
      }
      if (
        (item.prop === 'postAddress' || item.prop === 'detail') &&
        menuItem?.expressWays
      ) {
        item.hidden = ['1', '2'].includes(wayIds[0]);
      }
    });
    console.log(_otherFormList, '_otherFormList');
    _setOtherFormList(_otherFormList);
  };

  useEffect(() => {
    console.log('422');
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

  //获取已经预约的时间段
  useEffect(() => {
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
              .map((n) => dayjs(n.bookDateTime).format('YYYY/MM/DD HH:mm:00')),
          ]),
        ];
        console.log(result, 'result');
        _otherFormList.find((n) => n.prop === 'bookDateTime').invalidTimes =
          result;
        setStorageSync('invalidTimes', result);
        setInvalidTimes(result);
      }
    });
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
    if (otherInfo.expressWay === '3' && !otherInfo?.bookDateTime) {
      return toast('上门服务时间不为空');
    }
    if (
      selectMenuItem?.isRite === 1 &&
      otherInfo?.isRite == 1 &&
      !otherInfo?.riteDateTime
    ) {
      return toast('预约仪式日期不为空');
    }
    // if (selectMenuItem?.isHandleWay === 1 && !otherInfo?.handleDateTime) {
    //   return toast('纪念物获取时间不为空');
    // }
    if (['2'].includes(otherInfo?.handleWay) && !otherInfo?.handleDateTime) {
      return toast('纪念物获取时间不为空');
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
      isSelfExpress: 2,
      expressWay: +otherInfo.expressWay,
    });
    navigateTo({
      url: './additionalService/index',
    });
  };

  const handleRiteChange = (val) => {
    console.log('handleRiteChangex--------46', val);
  };

  const handleFormDataChange = (propName: string, val: any) => {
    console.log('handleFormDataChange+411', val, propName);
    const checkProps = ['handleWay', 'handleDateTime', 'postAddress', 'detail'];
    const { menuId, petname, type, subType } = val;
    const isMenuA = menuList.findIndex((n) => n.id === val.menuId) === 1;

    if (propName === 'menuId') {
      _otherFormList.forEach((item: any) => {
        item.hidden = checkProps.includes(item.prop) && isMenuA;

        if (
          [
            'petStoreId',
            'postAddress',
            'detail',
            'province',
            'city',
            'detail',
            'area',
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
          petStoreId: '',
          postAddress: '',
          detail: '',
          // expressWay: '1',
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
            // expressWay: '1',
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
          if (item.prop === 'bookDateTime') {
            item.hidden = true;
          }
          if (['petStoreId', 'postAddress', 'detail'].includes(item.prop)) {
            item.hidden = true;
            model['petStoreId'] = '';
            model['postAddress'] = '';
            model['detail'] = '';
            model['bookDateTime'] = '';
          }
        } else if (val?.expressWay === '2') {
          console.log('426', val.expressWay);
          if (item.prop === 'petStoreId') {
            item.hidden = false;
          }
          if (item.prop === 'bookDateTime') {
            item.hidden = true;
          }
          if (
            [
              'postAddress',
              'detail',
              'expressAddress',
              'bookDateTime',
            ].includes(item.prop)
          ) {
            item.hidden = true;
            model['postAddress'] = '';
            model['detail'] = '';
            model['bookDateTime'] = '';
          }
        } else if (val?.expressWay === '3') {
          if (item.prop === 'bookDateTime') {
            item.hidden = false;
          }
          if (item.prop === 'postAddress' || item.prop === 'detail') {
            item.hidden = false;
          }
          if (item.prop === 'expressAddress' || item.prop === 'petStoreId') {
            item.hidden = true;
            model['petStoreId'] = '';
          }
        }
        model['riteDateTime'] = '';
        model['handleDateTime'] = '';
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
      console.log('handleFormDataChange425++', val);
      if (val.riteDateTime && propName === 'bookDateTime') {
        setformModel({
          ...val,
          riteDateTime: '',
          handleDateTime: '',
        });
        return;
      } else if (!val.riteDateTime && propName === 'riteDateTime') {
        setformModel({
          ...val,
          handleDateTime: '',
        });
        return;
      }
      setformModel(val);
    }
  };

  useEffect(() => {
    console.log('bookDateTime变更411', formModel.bookDateTime);
  }, [formModel.bookDateTime]);

  useEffect(() => {
    console.log('menuList变更411');
    const showProps = ['handleWay', 'handleDateTime'];
    _otherFormList.forEach((item: any) => {
      if (item.prop === 'menuId') {
        item.tabsOptions = menuList.map((item: any) => ({
          id: item.id,
          label: item.name,
          content: item.description,
        }));
        item.tabsTitle = menuList.map((iten: any) => iten.name);
      }
      //重置
      // if (showProps.includes(item.prop) && item.hidden === undefined) {
    });
    console.log(formModel, '422');
    getExpressOptions(menuList[0]?.id);
  }, [menuList]);

  useUnload(() => {
    console.log('卸载');
    setMenuList([]);
    _setOtherFormList([]);
  });

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
            invalidTimes={invalidTimes}
          >
            {{
              handleRiteChange,
            }}
          </AddForm>
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
