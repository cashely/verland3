import { useState, useRef, useEffect, useContext } from 'react';
import { View, Label, Checkbox, Text, CheckboxGroup } from '@tarojs/components';
import {
  useLoad,
  showToast,
  navigateTo,
  setStorageSync,
  getStorageSync,
} from '@tarojs/taro';
import { AtButton } from 'taro-ui';
import { otherFormList, baseInfoFormList } from './model';
import AddForm from '@/components/AddForm';
//import AppContext from '@/hooks/useContext';
import { menu } from '@/apis/common';
import './index.scss';
import regexObj from '@/utils/regexObj';

export default () => {
  const baseInfoRef = useRef(null);
  const otherInfoRef = useRef(null);
  const [agreement, setAggreement] = useState('');
  const [menuList, setMenuList] = useState([]);
  const [formModel, setformModel] = useState({
    isRite: '1',
    menuId: menuList?.[0]?.id,
  });
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
      console.log('menu', res);
      if (res?.code === 200) {
        setMenuList(res?.data || []);
      }
    });
  }, []);
  const handleSubmit = () => {
    const baseInfo = baseInfoRef.current?.getFormValues() || {};
    const otherInfo = otherInfoRef.current?.getFormValues() || {};
    if (!baseInfo?.username) {
      return toast('联系人不为空');
    } else if (!baseInfo?.phone || !regexObj.phone.test(baseInfo.phone)) {
      return toast('请输入正确的手机号');
    } else if (!baseInfo?.type) {
      return toast('爱宠类型不为空');
    } else if (!otherInfo?.bookDateTime) {
      return toast('上门服务时间不为空');
    } else if (otherInfo.isRite === '1' && !otherInfo.riteDateTime) {
      return toast('仪式日期不为空');
    } else if (
      ['1', '2'].includes(otherInfo?.handleWay) &&
      !otherInfo?.handleDateTime
    ) {
      return toast('遗物处理时间不为空');
    }
    if (!otherInfo?.postAddress || !otherInfo?.detail) {
      return toast('接收地址不完整（包含门牌号）');
    }

    if (!agreement) {
      return toast('请勾选用户购买套餐协议');
    }

    const combineInfo = {
      ...baseInfo,
      ...otherInfo,
    };

    console.log('combineInfo？》》》》》》》》》', combineInfo);
    //添加数据到缓存
    setStorageSync(
      'bookInfo',
      JSON.stringify({
        ...combineInfo,
        type: combineInfo?.type?.split('/')[0],
        subType: combineInfo?.type?.split('/')[1],
        weight: +combineInfo.weight,
        isRite: +combineInfo.isRite,
        bookDateTime: new Date(combineInfo.bookDateTime),
        riteDateTime: new Date(combineInfo.riteDateTime),
        handleDateTime: new Date(combineInfo.handleDateTime),
      })
    );
    navigateTo({
      url: './additionalService/index',
    });
  };

  const handleAgreementChange = (e) => {
    setAggreement(e.detail.value);
  };
  const handleRiteChange = (val) => {
    console.log('handleRiteChangex--------s', val);
  };

  useEffect(() => {
    const userInfo = getStorageSync('userInfo');
    console.log('userInfo', userInfo);
    // if (userInfo?.username) {
    //  setformModel({ ...formModel, username: userInfo?.username });
    //}
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
    setformModel({
      ...formModel,
      menuId: menuList?.[0]?.id,
    });
  }, [menuList]);

  return (
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
            <Text className="txt">用户购买套餐协议</Text>
          </Label>
        </CheckboxGroup>
      </View>

      <View className="flex btnList">
        <AtButton className="flex-1 btn" onClick={handleSubmit} type="primary">
          下一步
        </AtButton>
      </View>
    </View>
  );
};
