import request from './index';

const APIS = {
  LIST: '/mp/advise', // 发票
  ADD: '/mp/advise', // 新增
  DETAIL: '/mp/advise/:id', // 详情
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

export { list, add, detail };
