import { useState, useRef, useEffect, Suspense } from 'react';
import { PageMeta, View } from '@tarojs/components';
import {
  useLoad,
  showToast,
  navigateTo,
  setStorageSync,
  useUnload,
  showModal,
} from '@tarojs/taro';
import { AtButton, AtToast } from 'taro-ui';
import { otherFormList, baseInfoFormList } from './model';
import AddForm from '@/components/AddForm';
import { PET_RECEIVE_WAYS } from '@/constants';
import regexObj from '@/utils/regexObj';
//import AppContext from '@/hooks/useContext';
import { storeList } from '@/apis/pet';
import { isBooked } from '@/apis/book';
import { menu, checkRite } from '@/apis/common';
import dayjs from 'dayjs';

import './index.scss';

export default () => {
  const baseInfoRef = useRef(null);
  const otherInfoRef = useRef(null);
  const [menuList, setMenuList] = useState([]);
  const [formModel, setformModel] = useState({
    // handleWay: '2',
    // isRite: '1',
    // handleWay: '1',
  });

  useLoad(() => {
    console.log('Page loaded.');
    _setOtherFormList(otherFormList);
  });
  const [_otherFormList, _setOtherFormList] = useState([...otherFormList]);
  const [_baseInfoFormList, _setBaseInfoFormList] = useState(baseInfoFormList);
  const [invalidTimes, setInvalidTimes] = useState<string[]>([]);
  const [invalidRiteTimes, setInvalidRiteTimes] = useState<string[]>([]);

  const toast = (text: string) => {
    showToast({
      title: text,
      icon: 'none',
      duration: 5000,
    });
  };

  const getExpressOptions = (menuId: string) => {
    const menuItem = menuList.find((o) => o.id === menuId);
    const wayIds = menuItem?.expressWays?.split(',') || [];
    setformModel((d) => {
      d['isRite'] = menuItem?.isRite == 2 ? undefined : menuItem?.isRite;
      d.expressWay = wayIds[0] || null;
      return d;
    });
    console.log(wayIds, 'wayIds', menuItem);
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
      if (item.prop === 'handleWay' || item.prop === 'handleDateTime') {
        item.hidden = menuItem?.isHandleWay == 2;
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
    const start = dayjs().startOf('year').format('YYYY-MM-DD HH:mm:ss');
    const end = dayjs().endOf('year').format('YYYY-MM-DD HH:mm:ss');
    isBooked({
      start,
      end,
    }).then((res) => {
      console.log('res', res);
      if (res?.code === 200) {
        const result = [
          ...new Set([
            ...res?.data
              ?.filter((n) => n.bookDateTime)
              .map((n) => dayjs(n.bookDateTime).format('YYYY-MM-DD HH:mm:00')),
          ]),
        ];
        console.log(result, 'result');
        _otherFormList.find((n) => n.prop === 'bookDateTime').invalidTimes =
          result;
        setStorageSync('invalidTimes', result);
        setInvalidTimes(result);
      }
    });
    checkRite({
      start,
      end,
    }).then((res) => {
      if (res?.code === 200) {
        const result = [
          ...new Set([
            ...res?.data
              ?.filter((n) => n.riteDateTime)
              .map((n) => dayjs(n.riteDateTime).format('YYYY-MM-DD HH:mm:00')),
          ]),
        ];
        setStorageSync('invalidRiteTimes', result);
        setInvalidRiteTimes(result || []);
      }
    });
  }, []);

  const handleSubmit = async () => {
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
    if (otherInfo.expressWay == 3 && !otherInfo?.bookDateTime) {
      return toast('上门服务时间不为空');
    }

    if (otherInfo?.isRite == 1) {
      if (otherInfo?.riteDateTime) {
        //判断时间是否是当前时间2小时之后
        const now = new Date();
        const riteDateTime = new Date(otherInfo?.riteDateTime);
        if (riteDateTime.getTime() - now.getTime() < 2 * 60 * 60 * 1000) {
          return showModal({
            content: '预约日期时间必须在当前时间两小时以后，请重新选择',
            showCancel: false,
          });
        }
      } else {
        return toast('预约仪式日期不为空');
      }
    }

    if (otherInfo?.expressWay == 3) {
      if (otherInfo?.bookDateTime) {
        //判断时间是否是当前时间2小时之后
        const now = new Date();
        const bookDateTime = new Date(otherInfo?.bookDateTime);
        if (bookDateTime.getTime() - now.getTime() < 2 * 60 * 60 * 1000) {
          return showModal({
            content: '上门服务时间必须在当前时间两小时以后，请重新选择',
            showCancel: false,
          });
        }
      } else {
        return toast('预约仪式日期不为空');
      }
    }

    if (
      otherInfo?.handleWay == 2 &&
      otherInfo.isRite == 1 &&
      !otherInfo?.handleDateTime
    ) {
      return toast('纪念物获取时间不为空');
    }
    if (otherInfo.expressWay == 2) {
      if (!otherInfo.petStoreId) {
        return toast('请选择宠物门店');
      }
    } else if (otherInfo.expressWay == 3) {
      if (!otherInfo?.postAddress || !otherInfo?.detail) {
        return toast('收取地址不完整（包含门牌号）');
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
    const selectItem = menuList.find((n) => n.id === val.menuId) || {};

    if (propName === 'menuId') {
      _otherFormList.forEach((item: any) => {
        item.hidden = checkProps.includes(item.prop);

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
      });
      console.log(selectItem, '512');
      setformModel({
        ...val,
        menuId,
        petname,
        type,
        subType,
        handleDateTime: selectItem?.isHandleWay == 1 ? '' : undefined,
        bookDateTime: selectItem?.isRite == 1 ? '' : undefined,
        isRite: selectItem?.isRite == 1 ? '1' : undefined,
        handleWay: selectItem?.isHandleWay == 1 ? '2' : undefined,
        expressWay: selectItem?.expressWays?.split(',') || [],
      });
      getExpressOptions(val.menuId);
    } else if (propName === 'isRite') {
      console.log('isRite411', val.isRite);
      _otherFormList.find((item) => item.prop === 'riteDateTime').hidden =
        val.isRite === '2';

      setformModel({
        ...val,
        riteDateTime: val.isRite === '2' ? undefined : val.riteDateTime,
        handleDateTime:
          val.isRite === '2'
            ? undefined
            : val.handleWay == 2
            ? undefined
            : val.handleDateTime,
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
        model['isRite'] = selectItem?.isRite == 1 ? '1' : undefined;
        model['handleWay'] = selectItem?.isHandleWay == 1 ? '2' : undefined;
      });
      setformModel((d) => {
        return {
          ...d,
          ...val,
          ...model,
          // isRite: '1',
        };
      });
    } else if (propName === 'location' || propName === 'detail') {
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
      } else if (val.riteDateTime && propName === 'riteDateTime') {
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
    console.log('menuList变更411', menuList);

    _otherFormList.forEach((item: any) => {
      if (item.prop === 'menuId') {
        item.tabsOptions = menuList.map((item: any) => ({
          id: item.id,
          label: item.name,
          content: JSON.parse(item.description),
        }));
        item.tabsTitle = menuList.map((iten: any) => iten.name);
      }
      //重置
      // if (showProps.includes(item.prop) && item.hidden === undefined) {
    });
    console.log(formModel, '422');
    getExpressOptions(menuList[0]?.id);
  }, [menuList.length]);

  useUnload(() => {
    setMenuList([]);
    _setOtherFormList([]);
  });

  const [pageStyle, setPageStyle] = useState({});

  const handleSetPageStyle = (flag) => {
    setPageStyle({ overflow: flag ? 'hidden' : 'auto', height: '100%' });
  };

  return (
    <Suspense fallback={<AtToast isOpened text="loading"></AtToast>}>
      <PageMeta pageStyle="background:red"> 12 </PageMeta>
      <View className="pt-20 page-createBox" style={pageStyle}>
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
            invalidRiteTimes={invalidRiteTimes}
            setPageStyle={handleSetPageStyle}
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
