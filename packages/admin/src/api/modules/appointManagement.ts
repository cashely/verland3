import type { RequestResult } from '../../index.d';
import request from "../request";

/**
 * @name 列表
 */

export async function list<T>(): Promise<RequestResult<T>> {
    return request.get("/list");
}

/**
 * @name 新增
 */

export async function add<T>(data: T): Promise<RequestResult<T>> {
    return request.post("/list", data);
}


/**
 * @name 修改
 */

export async function edit<T>(data: {
    id: string;
}): Promise<RequestResult<T>> {
    return request.put("/put", data);
}


/**
 * @name 删除
 */

export async function del<T>(id: string): Promise<RequestResult<T>> {
    return request.delete(`/delete/${id}`);
}