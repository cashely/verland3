import type { TreeDataNode } from 'antd';

declare module 'objutil' {
      function isEqual(obj1: any, obj2: any): boolean;
}

declare module '*.json' {
      const value: any;
      export default value;
}

export interface IProject {
      id: number;
      name: string;
      description: string;
      [key: string]: any;
}

export interface RequestResult<T> {
      code: number;
      data?: T;
      message?: string;
}

export type TTreeNode = {
      name: string;
      nodeType?: 'new' | 'folder' | 'document';
      protocal?: number;
      id?: string;
      folderId?: string;
      projectId?: string;
      path?: string;
      description?: string;
      type?: 0 | 1;
      useTemplate?: 1 | 2;
      content?: string;
      children?: TTreeNode[];
} & TreeDataNode;