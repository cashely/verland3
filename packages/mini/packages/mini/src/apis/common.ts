import request from './index';

const APIS = {
  LOGIN: '/login/mp',
  TEST: '/mp/user',
  File: '/file',
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

export { loginApi, testApi, uploadFile };
