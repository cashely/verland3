import type { RequestResult } from '../..';
import request from "../request";

/**
 * @name 列表
 */

export async function list<T>(): Promise<RequestResult<T>> {
    return request.get("/bookGood");
}

/**
 * @name 新增
 */

export async function add<T>(data: T): Promise<RequestResult<T>> {
    return request.post("/bookGood", data);
}


/**
 * @name 修改
 */

export async function edit<T>(data: {
    id: string;
}): Promise<RequestResult<T>> {
    return request.put("/bookGood", data);
}


/**
 * @name 删除
 */

export async function del<T>(id: string): Promise<RequestResult<T>> {
    return request.delete(`/bookGood/${id}`);
}