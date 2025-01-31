import type { RequestResult } from '../../index.d';
import request from "../request";

/**
 * @name 登录
 */

export async function loginApi<T>(data: {
    username: string;
    password: string;
}): Promise<RequestResult<T>> {
    return request.post("/login", data);
}