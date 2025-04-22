import type { RequestResult } from '../..';
import request from '../request';

/**
 * @name 列表
 */

export function list<T>(params: any): Promise<RequestResult<T>> {
  return request.get(`/ticket?${new URLSearchParams(params).toString()}`);
}

export function listCount<T>(params: any): Promise<RequestResult<T>> {
  return request.get(`/ticket/count?${new URLSearchParams(params).toString()}`);
}

/**
 * @name 详情
 */

export async function detail<T>(id: string): Promise<RequestResult<T>> {
  return request.get(`/ticket/${id}`);
}

/**
 * @name 修改
 */

export async function edit<T>(
  id: string,
  data: any
): Promise<RequestResult<T>> {
  return request.put(`/ticket/${id}`, data);
}
