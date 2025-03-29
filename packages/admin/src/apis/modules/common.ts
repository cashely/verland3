import type { RequestResult } from '../..';
import request from '../request';

/**
 * @name 登录
 */

export async function loginApi<T>(data: {
  username: string;
  password: string;
}): Promise<RequestResult<T>> {
  return request.post('/login', data);
}

/**
 * @name 获取当前用户
 */

export async function adminUser<T>(): Promise<RequestResult<T>> {
  return request.get('/adminUser');
}

/**
 * @name 退出
 */

export async function logoutApi<T>(): Promise<RequestResult<T>> {
  return request.post('/login');
}

/**
 * @name 上传文件
 */

export async function uploadFile<T>(): Promise<RequestResult<T>> {
  return request.post('/file');
}

//menu
/**
 * @name 菜单列表
 */
export function menuList<T>(): Promise<RequestResult<T>> {
  return request.get('/menu');
}

//获取menu
/**
 * @name 获取菜单详情
 */
export async function menuDetail<T>(id: string): Promise<RequestResult<T>> {
  return request.get(`/menu/${id}`);
}

/**
 * @name 创建菜单
 */
export function menuCreate<T>(data: any): Promise<RequestResult<T>> {
  return request.post('/menu', data);
}

/**
 * @name 更新菜单
 */
export function menuUpdate<T>(
  id: number,
  data: any
): Promise<RequestResult<T>> {
  return request.put(`/menu/${id}`, data);
}

/**
 * @name 删除菜单
 */
export function menuDelete<T>(id: number): Promise<RequestResult<T>> {
  return request.delete(`/menu/${id}`);
}
