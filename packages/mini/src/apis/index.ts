import Taro, { clearStorageSync, getStorageSync } from '@tarojs/taro';
import {
  showToast,
  showLoading,
  hideLoading,
  redirectTo,
  showModal,
  getCurrentPages,
} from '@tarojs/taro';
import { relogin } from '@/apis/relogin';
export const baseUrl = process.env.TARO_APP_API;
export const fileUrl = process.env.TARO_APP_API;
let loadingInstance: any = null;
export default function (
  url: string,
  options: any = {},
  searchParams: any = '',
  showloading: boolean = true
) {
  return new Promise<any>((resolve, reject) => {
    if (!loadingInstance && showloading) {
      loadingInstance = showLoading();
    }
    const token = getStorageSync('token') || '';
    const userInfo = getStorageSync('userInfo') || {};
    Taro.request({
      url:
        baseUrl +
        url +
        `${token ? `${searchParams ? '?' + searchParams : ''}` : ''}`,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'content-type': 'application/json',
        id: userInfo?.id || '',
        token: `Bearer ${token}`,
      },
      success: (res) => {
        console.log(res, '----');
        const data = res.data;
        if (data?.code === 400) {
          const errText = data.message?.[0].message || data.message;
          if (errText?.length > 20) {
            showModal({
              content: errText ?? '系统错误',
              showCancel: false,
            });
            hideLoading();
          } else {
            showToast({
              title: errText ?? '系统错误',
              icon: 'none',
              duration: 2000,
            });
          }
          return;
        } else if (data?.code === 401) {
          //过期重新登录

          console.log(res, 'xxxx');
          clearStorageSync();
          relogin().then((res) => {
            console.log('424', res);
            if (!res) {
              Taro.navigateTo({ url: '/pages/createBook/index' });
            } else {
              console.log(getCurrentPages());
              const pageLen = getCurrentPages().length;
              const currentPage = getCurrentPages()[pageLen - 1];
              redirectTo({
                url: ('/' + currentPage.route) as string,
              });
            }
          });

          return;
        }

        resolve(res.data);
        loadingInstance && (hideLoading(), (loadingInstance = null));
      },
      fail: (err) => {
        console.log(err, '错误信息');
        showToast({
          title: '网络错误',
          icon: 'none',
          success: () => {
            setTimeout(function () {
              loadingInstance && (hideLoading(), (loadingInstance = null));
            }, 1000);
            clearStorageSync();
            reject(err);
          },
        });
      },
    });
  });
}
