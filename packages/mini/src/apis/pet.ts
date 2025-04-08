import request from './index';

const APIS = {
  LIST: '/mp/pet', // 发票
  ADD: '/mp/pet', // 新增
  DETAIL: '/mp/pet/:id', // 详情
  PUT: '/mp/pet', // 更新
  STORE: '/mp/petStore', // 删除
};

/**
 * @name list
 * @description 获取列表
 */
const list = () => {
  return request(APIS.LIST, {
    method: 'get',
  });
};

const storeList = () => {
  return request(APIS.STORE, {
    method: 'get',
  });
};

/** 新增 */
const add = (data) => {
  return request(APIS.ADD, {
    method: 'post',
    data,
  });
};

/** 获取详情 */
const detail = (id) => {
  return request(APIS.DETAIL.replace(':id', id), {
    method: 'get',
  });
};

/** 修改 */
const put = (id) => {
  return request(APIS.PUT.replace(':id', id), {
    method: 'put',
  });
};
export { list, add, detail, put, storeList };
