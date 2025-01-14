import staticMethods from "antd/es/message";
import { Slice } from "./index.d";
export type LoadingState = {
      loading: boolean;
      loadingTimer: number | null;
}

export type loadingActions = {
      openLoading: () => void;
      closeLoading: () => void;
}

export type LoadingStore = LoadingState & loadingActions;

const loadingSlice: Slice<LoadingState, loadingActions> = (set) => {
      let timer = NaN;
      return {
            loading: false,
            loadingTimer: null,
            openLoading: () => {
                  set((state) => {
                        clearTimeout(timer);
                        state.loading = true;
                  })
            },
            closeLoading: () => {
                  timer = setTimeout(() => {
                        set((state) => {
                              state.loading = false;
                        })
                  }, 300);

            }
      }
}

export default loadingSlice;