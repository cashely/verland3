import type { RequestResult } from '../..';
import request from "../request";

/**
 * @name 列表
 */

export async function list<T>(): Promise<RequestResult<T>> {
    return request.get("/ticket");
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

export async function edit<T>(id: string): Promise<RequestResult<T>> {
    return request.put(`/ticket/${id}`);
}