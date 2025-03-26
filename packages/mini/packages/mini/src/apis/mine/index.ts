import request from '../index';

const APIS = {
  USERINFO: '/mp/user',
};

const getUserInfo = (data) => {
  return request(APIS.USERINFO, {
    method: 'get',
    data,
  });
};

export { getUserInfo };
