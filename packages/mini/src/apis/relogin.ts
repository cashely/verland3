import { mpLogin, getUser, putUser } from '@/apis/user';
import { setStorageSync, login } from '@tarojs/taro';
import { navigateTo } from '@tarojs/taro';
const relogin = (useInfo?: {
  avatar: string;
  nickname: string;
  gender: number;
  phone: string;
}) => {
  return new Promise(async (resolve, reject) => {
    // 登录逻辑
    const res = await login();
    if (res.errMsg === 'login:ok') {
      mpLogin({ code: res.code }).then(async (res) => {
        if (res.code === 200) setStorageSync('token', res.data);
        console.log(res, '====');
        //拿到token之后获取用户信息
        const { data, code } = await getUser();
        if (code === 200) {
          if (!data.phone) {
            //没有用户手机号就去登录
            return reject(false);
          }
          //如果当前用户没有头像或者名称那就从微信获取
          if (useInfo) {
            //取微信用户信息
            data.avatar = useInfo.avatar;
            data.username = useInfo.nickname;
            data.nickname = useInfo.nickname;
            data.gender = useInfo.gender || 0;
            data.phone = useInfo.phone; //手机号

            //更新用户信息
            await putUser({
              ...data,
              addressId: data.addressId || undefined,
            });
          }
          setStorageSync('userInfo', data);
          resolve(data);
        } else {
          reject(false);
        }
      });
    } else {
      reject(false);
    }
  });
};

export default relogin;

export { relogin };
