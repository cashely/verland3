import request from './index';

const APIS = {
  LOGIN: '/login/mp',
  TEST: '/mp/user',
  File: '/file',
  MENU: '/mp/menu',
};

const loginApi = (data) => {
  return request(APIS.LOGIN, {
    methods: 'POST',
    data,
  });
};

const uploadFile = (data) => {
  return request(APIS.File, {
    methods: 'POST',
    data,
  });
};

const testApi = () => {
  return request(APIS.TEST, {
    methods: 'GET',
  });
};

//小程序菜单
const menu = () => {
  return request(APIS.MENU, {
    methods: 'post',
  });
};

export { loginApi, testApi, uploadFile, menu };
