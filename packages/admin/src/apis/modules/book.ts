import type { RequestResult } from '../..';
import request from '../request';

/**
 * @name 列表
 */

export async function list<T>(params: any): Promise<RequestResult<T>> {
  return request.get(`/book?${new URLSearchParams(params).toString()}`);
}

/**
 * @name 详情
 */

export async function detail<T>(id: string): Promise<RequestResult<T>> {
  return request.get(`/book/${id}`);
}

/**
 * @name 新增
 */
export async function edit<T>(
  id: string,
  statu: number
): Promise<RequestResult<T>> {
  return request.put(`/book/${id}`, { statu });
}

/**
 * @name 查询退款详情
 */
export async function refundDetail<T>(outTradeNo: string): Promise<RequestResult<T>> {
  return request.get(`/wxpay/refundStatu/${outTradeNo}`); 
}

