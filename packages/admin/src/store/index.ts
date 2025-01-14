import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import {
      ProjectsActions,
      ProjectsState,
      FoldersActions,
      FoldersState,
      DocumentActions,
      DocumentState,
} from './index.d';
import loadingSlice, { LoadingStore } from './loadingSlice';

type Store =
      & LoadingStore;

const useStore = create<Store, any>(immer((set, ...a) => ({

      ...loadingSlice(set, ...a),
})));

export default useStore;