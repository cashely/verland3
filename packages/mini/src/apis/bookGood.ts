import request from './index';

const APIS = {
  LIST: '/mp/bookGood', // 列表
  DETAIL: '/mp/bookGood/:id', // 详情
};
// 附加服务
/**
 * @name list
 * @description 获取列表
 */
const list = () => {
  return request(APIS.LIST, {
    method: 'get',
  });
};

/** 获取详情 */
const detail = (id) => {
  return request(APIS.DETAIL.replace(':id', id), {
    method: 'get',
  });
};

export { list, detail };
