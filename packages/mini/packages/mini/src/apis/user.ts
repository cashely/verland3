import request from './index';

const APIS = {
  USERINFO: '/mp/user', // 发票
  LOGIN: '/login/mp',
};

/**
 * @name getUser
 * @description 获取用户信息
 */
const getUser = () => {
  return request(APIS.USERINFO, {
    method: 'get',
  });
};

const putUser = (data) => {
  return request(APIS.USERINFO, {
    method: 'put',
    data,
  });
};

/**
 * @name login
 * @description 获取用户信息
 */
const mpLogin = (data) => {
  return request(APIS.LOGIN, {
    method: 'post',
    data,
  });
};

export { getUser, mpLogin, putUser };
