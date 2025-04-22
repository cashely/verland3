import type { RequestResult } from '../..';
import request from '../request';

/**
 * @name 列表
 */

export async function list<T>(params: any): Promise<RequestResult<T>> {
  return request.get(`/petStore?${new URLSearchParams(params).toString()}`);
}

export function listCount<T>(params: any): Promise<RequestResult<T>> {
  return request.get(
    `/petStore/count?${new URLSearchParams(params).toString()}`
  );
}
/**
 * @name 新增
 */

export async function add<T>(data: T): Promise<RequestResult<T>> {
  return request.post('/petStore', data);
}

/**
 * @name 详情
 */

export async function detail<T>(id: string): Promise<RequestResult<T>> {
  return request.get(`/petStore/${id}`);
}

/**
 * @name 修改
 */

export async function edit<T>(
  id: string,
  data: any
): Promise<RequestResult<T>> {
  return request.put(`/petStore/${id}`, data);
}
