import request from './index';

const APIS = {
  LOGIN: '/login/mp',
  TEST: '/mp/user',
  File: '/file',
  MENU: '/mp/menu',
  checkBook: '/mp/book/checkBookDateTime',
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
    method: 'get',
  });
};

const checkBook = (bookDateTime: string) => {
  return request(APIS.checkBook, {
    method: 'post',
    data: {
      bookDateTime,
    },
  });
};

export { loginApi, testApi, uploadFile, menu, checkBook };
