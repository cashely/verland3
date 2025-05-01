import request from './index';

const APIS = {
  LOGIN: '/login/mp',
  TEST: '/mp/user',
  File: '/file',
  MENU: '/mp/menu',
  checkBook: '/mp/book/checkBookDateTime',
  checkRiteDateTime: '/mp/book/checkRiteDateTime',
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

const checkRiteDateTime = (riteDateTime: any) => {
  return request(APIS.checkRiteDateTime, {
    method: 'post',
    data: {
      riteDateTime,
    },
  });
};

export { loginApi, checkRiteDateTime, testApi, uploadFile, menu, checkBook };
