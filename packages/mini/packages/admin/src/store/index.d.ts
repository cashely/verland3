import { type RequestResult } from '../index';
import { LoadingState, loadingActions } from './loadingSlice';

export type Slice<T, U> = (
      set: (fn: (state: Store) => void) => void,
      get: () => T,
      ...e: any
) => U & T;

export interface ProjectsState {
      projects: Record<string, any>[];
}

export interface ProjectsActions {
      updateProjects: (projects: Record<string, any>[]) => void;
}

export interface FoldersState {
      folders: Record<string, any>[];
}

export interface FoldersActions {
      updateFolders: (folders: Record<string, any>[]) => void;
}

export interface DocumentState {
      /**
       * @name 选中的文档
       */
      selectedDocument: Record<string, any>;
}

interface UserInfoState {
      userInfo: Record<string, any>;
}

interface UserInfoActions {
      updateUserInfo: (userInfo: Record<string, any>) => void;
      fetchUserInfo: (fn: (args?: any[]) => Promise<RequestResult<any>>) => void;
}

export type UserInfoStore = UserInfoState & UserInfoActions;

type Store =
      UserInfoStore
      & ProjectsState
      & ProjectsActions
      & FoldersState
      & FoldersActions
      & DocumentState
      & DocumentActions
      & LoadingState
      & loadingActions;

export interface DocumentActions {
      updateSelectedDocument: (document: Record<string, any>) => void;
      fetchDocument: (fn: (id: number | string) => Promise<RequestResult<any>>, id) => any;
      clearSelectedDocument: () => void;
      setSelectedDocument: Parameters<Slice<DocumentState, DocumentActions>>[0];
}