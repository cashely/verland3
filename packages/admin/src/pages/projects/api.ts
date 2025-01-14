import $ from '../../utils/request';
import { RequestResult } from '../..';

export function getProjectsApi<T>(): Promise<Required<RequestResult<T>>> {
  return $.get('/project');
}

export function getProjectApi<T>(id: number | string): Promise<T> {
  return $.get(`/project/${id}`);
}

export function createProjectApi<T, R>(data: T): Promise<R> {
  return $.post('/project', data);
}

/**
 * @name 根据项目id统计文档数量
 * @param id 项目id
 */
export function getProjectDocCountApi<T>(id: number): Promise<Required<RequestResult<T>>> {
  return $.get(`/document/count`, { params: { projectId: id }});
}

/**
 * @name 根据项目id删除文档
 */
export function deleteProjectApi<T>(id: number): Promise<Required<RequestResult<T>>> {
  return $.delete(`/project/${id}`);
}

/**
 * @name 根据项目id更新文档
 */
export function updateProjectApi<T, R>(id: number | string, data: T): Promise<RequestResult<R>> {
  return $.put(`/project/${id}`, data);
}