import type { RequestResult } from '../..';
import request from '../request';

/**
 * @name 列表
 */

export async function list<T>(): Promise<RequestResult<T>> {
  return request.get('/advise');
}

/**
 * @name 详情
 */

export async function detail<T>(id: string): Promise<RequestResult<T>> {
  return request.get(`/advise/${id}`);
}

/**
 * @name 修改
 */

export function edit<T>(id: string, data: T): Promise<RequestResult<T>> {
  return request.put(`/advise/${id}`, data);
}
