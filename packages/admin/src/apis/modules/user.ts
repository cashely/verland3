import type { RequestResult } from '../..';
import request from "../request";

/**
 * @name 列表
 */

export async function list<T>(): Promise<RequestResult<T>> {
    return request.get("/user");
}

/**
 * @name 详情
 */

export async function detail<T>(id: string): Promise<RequestResult<T>> {
    return request.get(`/user/${id}`);
}
