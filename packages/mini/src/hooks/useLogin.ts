import {
  getStorageSync,
  setStorageSync,
  clearStorageSync,
  getUserInfo,
  showToast,
  login,
  checkSession,
  useDidShow,
} from '@tarojs/taro';
import { useEffect, useState } from 'react';
import { mpLogin, getUser } from '@/apis/user';

function useLogin() {
  const token = getStorageSync('token');
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  const [userInfo, setUserInfo] = useState({});

  // 检查登录状态
  useEffect(() => {
    console.log('useEffect, isLoggedIn', isLoggedIn);
    checkLoginStatus();
  }, []);

  useDidShow(() => {
    if (token && isLoggedIn) {
      setUserInfo({
        ...userInfo,
        ...getStorageSync('userInfo'),
      });
    }
  });
  useEffect(() => {
    if (!token) {
      setIsLoggedIn(false);
      setUserInfo({});
      clearStorageSync();
    }
  }, [token]);
  // useEffect(() => {
  //   console.log('useEffect, isLoggedIn', isLoggedIn);
  // }, [isLoggedIn]);

  // 检查登录状态的函数
  const checkLoginStatus = async () => {
    try {
      const res = await checkSession();
      if (res.errMsg === 'checkSession:ok' && token) {
        setIsLoggedIn(true);
        setUserInfo({
          ...userInfo,
          ...getStorageSync('userInfo'),
        });
      } else {
        //清空缓存
        if (token) clearStorageSync();
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('检查登录状态失败', error);
      setIsLoggedIn(false);
    }
  };

  // 获取用户信息
  const fetchUserInfo = async (code, initUserInfo: any) => {
    try {
      mpLogin({ code }).then(async (res) => {
        if (res.code === 200) setStorageSync('token', res.data);
        console.log(res, '====');
        //拿到token之后获取用户信息
        const { data, code } = await getUser();
        if (code === 200) {
          //如果当前用户没有头像或者名称那就从微信获取
          if (!data.avatar || !data.username) {
            //取微信用户信息
            const { userInfo: wxUserInfo } = initUserInfo;
            console.log(wxUserInfo, 'wxUserInfo');
            data.avatar = wxUserInfo.avatarUrl;
            data.username = wxUserInfo.nickName;
            data.nickname = wxUserInfo.nickName;
            data.gender = wxUserInfo.gender;
          }
          setUserInfo({
            ...userInfo,
            ...data,
          });
          setStorageSync('userInfo', data);
          showToast({ title: '登录成功', icon: 'none' });
        }
      });
    } catch (error) {
      console.error('获取用户信息失败', error);
    }
  };

  // 登录函数
  const handleLogin = async () => {
    try {
      if (isLoggedIn) return; // 如果已经登录，直接返回
      const res = await login();
      if (res.errMsg === 'login:ok') {
        console.log('登录成功', res);
        setIsLoggedIn(true);
        fetchUserInfo(res.code);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('登录失败', error);
      setIsLoggedIn(false);
    }
  };

  return {
    isLoggedIn,
    userInfo,
    toLogin: handleLogin,
  };
}

export default useLogin;
