import { View, Image, Input, Button } from '@tarojs/components';
import { AtButton } from 'taro-ui';
import {
  showToast,
  setStorageSync,
  login,
  reLaunch,
  useLoad,
  uploadFile,
  redirectTo,
} from '@tarojs/taro';
import { useState } from 'react';
import { mpLogin, getUser, putUser } from '@/apis/user';
import regexObj from '@/utils/regexObj';
import { baseUrl } from '@/apis';
import relogin from '../../apis/relogin';
import './index.scss';
export default function Index() {
  const [userInfo, setUserInfo] = useState({
    avatar: '',
    nickname: '',
    phone: '',
  });

  const [pageFlag, setPageFlag] = useState('');
  const [btnDisabled, setBtnDisabled] = useState(false);
  useLoad(({ type = '' }) => {
    //1是预约页面 2是我的页面
    setPageFlag(type);
  });

  const _uploadFile = (filePath) => {
    return new Promise((resolve, reject) => {
      console.log(`${baseUrl}/file`, '上传图片');
      uploadFile({
        url: `${baseUrl}/file`,
        name: 'file',
        filePath,
        success: (res) => {
          if (res?.statusCode == 200) {
            const { data = {} } = res?.data ? JSON.parse(res.data) : {};
            resolve(baseUrl + '/' + data?.path);
          }
        },
        fail: () => {
          reject('上传失败');
          showToast({
            title: '上传失败',
            icon: 'none',
          });
        },
      });
    });
  };

  // 获取用户信息
  const fetchUserInfo = async (initUserInfo: any) => {
    try {
      setBtnDisabled(true);
      relogin(initUserInfo, 'login').then((res) => {
        if (!res) return setBtnDisabled(false);
        setTimeout(() => {
          pageFlag === '1'
            ? redirectTo({
                url: '/pages/createBook/index',
              })
            : reLaunch({
                url: '/pages/mine/index',
              });
        }, 200);
      });
    } catch (error) {
      setBtnDisabled(false);
    }
  };
  const handleLogin = async () => {
    if (!userInfo.avatar || !userInfo.nickname || !userInfo.phone) {
      showToast({
        title: '请选择头像和昵称',
        icon: 'none',
        duration: 1000,
      });
      return;
    }
    if (!regexObj.phone.test(userInfo.phone)) {
      showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000,
      });
      return false;
    }
    fetchUserInfo(userInfo);
  };

  const handleChoseAvatar = async (e) => {
    const { avatarUrl } = e.detail;
    const fileUrl = (await _uploadFile(avatarUrl)) as string;
    setUserInfo({ ...userInfo, avatar: fileUrl });
  };
  const handlePhoneChange = (e) => {
    const { value } = e.detail;
    setUserInfo({ ...userInfo, phone: value });
  };
  const handleChange = (e) => {
    const { value } = e.detail;
    setUserInfo({ ...userInfo, nickname: value });
  };
  return (
    <View className="page-login">
      <View className="header">
        <Button
          hoverClass="none"
          open-type="chooseAvatar"
          onChooseAvatar={handleChoseAvatar}
        >
          <Image src={userInfo.avatar} className="avatar" mode="widthFix" />
          <View className="text">点击选择头像</View>
        </Button>

        <View className="nickname">
          <Input
            type="nickname"
            placeholder="请输入昵称"
            className="nickname-input"
            maxlength={32}
            onInput={handleChange}
          />
        </View>
        <View className="nickname">
          <Input
            type="number"
            maxlength={11}
            placeholder="请输入手机号"
            className="nickname-input"
            onInput={handlePhoneChange}
          />
        </View>
      </View>
      <AtButton type="primary" disabled={btnDisabled} onClick={handleLogin}>
        登录
      </AtButton>
    </View>
  );
}
