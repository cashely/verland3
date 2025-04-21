import type { RequestResult } from '../..';
import request from '../request';

/**
 * @name 列表
 */

export function list<T>(params: any): Promise<RequestResult<T>> {
  return request.get(`/pet?${new URLSearchParams(params).toString()}`);
}

export function listCount<T>(params: any): Promise<RequestResult<T>> {
  return request.get(`/pet/count?${new URLSearchParams(params).toString()}`);
}

/**
 * @name 详情
 */

export async function detail<T>(id: string): Promise<RequestResult<T>> {
  return request.get(`/pet/${id}`);
}
