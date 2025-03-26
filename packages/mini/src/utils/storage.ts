import {
  getStorageSync,
  setStorageSync,
  removeStorageSync,
} from '@tarojs/taro';

export const getStorage = (key: string) => {
  return getStorageSync(key);
};

export const setStorage = (key: string, value: any) => {
  return setStorageSync(key, value);
};
export const removeStorage = (key: string) => {
  return removeStorageSync(key);
};
