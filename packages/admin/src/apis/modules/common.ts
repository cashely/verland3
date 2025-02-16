import type { RequestResult } from '../..';
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

/**
 * @name 获取当前用户
 */

export async function adminUser<T>(): Promise<RequestResult<T>> {
    return request.get("/adminUser");
}

/**
 * @name 退出
 */

export async function logoutApi<T>(): Promise<RequestResult<T>> {
    return request.post("/login");
}

/**
 * @name 上传文件
 */

export async function uploadFile<T>(): Promise<RequestResult<T>> {
    return request.post("/file");
}