import request from './index';

const APIS = {
  LIST: '/mp/ticket', // 发票
  ADD: '/mp/ticket', // 新增发票
  DETAIL: '/mp/ticket/:id', // 发票详情
};

/**
 * @name list
 * @description 获取发票列表
 */
const list = (data) => {
  return request(APIS.LIST, {
    method: 'get',
    data,
  });
};

/** 新增发票 */
const add = (data) => {
  return request(APIS.ADD, {
    method: 'post',
    data,
  });
};

/** 获取发票详情 */
const detail = (id) => {
  return request(APIS.DETAIL.replace(':id', id), {
    method: 'get',
  });
};

export { list, add, detail };
