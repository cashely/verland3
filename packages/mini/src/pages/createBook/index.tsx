import { useState, useRef } from 'react';
import { View, Label, Checkbox, Text, CheckboxGroup } from '@tarojs/components';
import { useLoad, showToast, navigateTo, setStorageSync } from '@tarojs/taro';
import { AtButton } from 'taro-ui';
import { otherFormList, baseInfoFormList } from './model';
import AddForm from '@/components/AddForm';
import './index.scss';

export default () => {
  const [formModel] = useState({});
  const baseInfoRef = useRef(null);
  const otherInfoRef = useRef(null);
  const [agreement, setAggreement] = useState('');
  useLoad(() => {
    console.log('Page loaded.');
  });
  const handleSubmit = () => {
    const baseInfo = baseInfoRef.current?.getFormValues() || {};
    const otherInfo = otherInfoRef.current?.getFormValues() || {};
    if (!baseInfo?.type) {
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
        // bookDateTime: new Date(),
        handleDateTime: new Date(combineInfo.expressDateTime),
        // totalAmount: 1000, //10元
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

    // setFo([...fo]);s
  };

  return (
    <View className="page-createBox pt-20">
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
