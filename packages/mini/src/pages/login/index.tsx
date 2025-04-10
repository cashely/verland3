import { View, Image, Input, Button } from '@tarojs/components';
import { AtButton } from 'taro-ui';
import {
  showToast,
  setStorageSync,
  login,
  reLaunch,
  useLoad,
  uploadFile,
} from '@tarojs/taro';
import { useState } from 'react';
import { mpLogin, getUser, putUser } from '@/apis/user';
import regexObj from '@/utils/regexObj';
import { baseUrl } from '@/apis';
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
    console.log(type, 'pageload');

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
          console.log(res, '上传图片成功');

          if (res?.statusCode == 200) {
            const { data = {} } = res?.data ? JSON.parse(res.data) : {};
            console.log(data);
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
  const fetchUserInfo = async (code, initUserInfo: any) => {
    try {
      setBtnDisabled(true);
      mpLogin({ code }).then(async (res) => {
        if (res.code === 200) setStorageSync('token', res.data);
        console.log(res, '====');
        //拿到token之后获取用户信息
        const { data, code } = await getUser();
        if (code === 200) {
          //如果当前用户没有头像或者名称那就从微信获取
          if (!data.avatar || !data.username) {
            //取微信用户信息
            data.avatar = initUserInfo.avatar;
            data.username = initUserInfo.nickname;
            data.nickname = initUserInfo.nickname;
            data.gender = initUserInfo.gender || 0;
            data.phone = initUserInfo.phone; //手机号
          }
          //更新用户信息
          await putUser({
            ...data,
            addressId: data.addressId || undefined,
          });
          setStorageSync('userInfo', data);
          showToast({ title: '登录成功', icon: 'none' });
          setTimeout(() => {
            setBtnDisabled(false);
            pageFlag === '1'
              ? reLaunch({
                  url: '/pages/index/index',
                })
              : reLaunch({
                  url: '/pages/mine/index',
                });
          }, 1000);
        }
      });
    } catch (error) {
      setBtnDisabled(false);
      console.log(error);
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
    // 登录逻辑
    const res = await login();
    console.log(res, '441+++');
    if (res.errMsg === 'login:ok') {
      fetchUserInfo(res.code, userInfo);
    }
  };

  const handleChoseAvatar = async (e) => {
    console.log('选择头像', e);
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
