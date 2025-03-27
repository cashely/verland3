import { useState, useRef, useEffect } from 'react';
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
import './index.scss';

export default () => {
  const [formModel, setformModel] = useState({
    username: '',
  });
  const baseInfoRef = useRef(null);
  const otherInfoRef = useRef(null);
  const [agreement, setAggreement] = useState('');
  useLoad(() => {
    console.log('Page loaded.');
  });
  const handleSubmit = () => {
    const baseInfo = baseInfoRef.current?.getFormValues() || {};
    const otherInfo = otherInfoRef.current?.getFormValues() || {};
    if (!baseInfo?.username) {
      return showToast({
        title: '联系人不为空',
        icon: 'none',
      });
    } else if (!baseInfo?.phone) {
      return showToast({
        title: '联系电话不为空',
        icon: 'none',
      });
    } else if (!baseInfo?.type) {
      return showToast({
        title: '爱宠类型不为空',
        icon: 'none',
      });
    }
    if (otherInfo?.handleWay) {
      if (!otherInfo?.handleDateTime) {
        return showToast({
          title: '遗物处理不为空',
          icon: 'none',
        });
      }
    }

    if (!agreement) {
      return showToast({
        title: '请勾选用户购买套餐协议',
        icon: 'none',
      });
    }

    console.log('combineInfo', agreement);

    const combineInfo = {
      ...baseInfo,
      ...otherInfo,
    };
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
        handleDateTime: new Date(combineInfo.expressDateTime),
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
    if (userInfo?.username) {
      setformModel({ ...formModel, username: userInfo?.username });
    }
  }, []);

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
          formList={otherFormList}
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
