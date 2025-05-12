import request from './index';

const APIS = {
  LOGIN: '/login/mp',
  TEST: '/mp/user',
  File: '/file',
  MENU: '/mp/menu',
  checkBook: '/mp/book/checkBookDateTime',
  checkRite: '/mp/book/hasRiteDate',
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

const checkRite = (params: any) => {
  const urlSearchParams = new URLSearchParams(params);
  // start=2023-12-12 00:00:10&end=2025-12-12 00:00:00
  console.log(params);
  return request(
    APIS.checkRite,
    {
      method: 'get',
    },
    urlSearchParams.toString()
  );
};

export {
  loginApi,
  checkRiteDateTime,
  testApi,
  uploadFile,
  menu,
  checkBook,
  checkRite,
};
