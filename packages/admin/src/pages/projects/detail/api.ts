import $ from '../../../utils/request';

export function getDocumentsApi<T>(projectId?: number | string ): Promise<T[]> {
  console.log({ params: { projectId }})
  return $.get('/document', { params: { projectId }});

}

export function getDocumentApi<T>(id: number | string): Promise<T> {
  return $.get(`/document/${id}`);
}

export function createDocumentApi<T, R>(data: T): Promise<R> {
  return $.post('/document', data);
}

export function updateDocumentApi<T, R>(id: number, data: T): Promise<R> {
  return $.put(`/document/${id}`, data);
}

/**
 * @name 删除文档
 */
export function deleteDocumentApi<T>(id: number | string): Promise<T> {
  return $.delete(`/document/${id}`);
}

/**
 * @name 创建文件夹
 */
export function createFolderApi<T, R>(data: T): Promise<R> {
  return $.post('/folder', data);
}

/**
 * @name 根据项目id查询文件夹
 * @param projectId
 */
export function getFoldersApi<T>(projectId?: number | string ): Promise<T[]> {
  return $.get('/folder', { params: { projectId }});
}

/**
 * @name 根据文档id获取操作日志
 */
export function getDocumentLogsApi<T>(id: number | string): Promise<T> {
  return $.get(`/logs/document/${id}`);
}

/**
 * @name 根据文件夹id获取访问日志
 */
export function getDocumentRequestsApi<T>(id: number | string): Promise<T> {
  return $.get(`/document/request/${id}`);
}