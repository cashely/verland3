import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer';
import { getCookie, setCookie } from '@/utils/cookies'

const appStore = create<Store, any>(immer((set, ...a) => ({
    sidebarStatus: getCookie('sidebarStatus') ? !!getCookie('sidebarStatus') : true,
    TOGGLE_SIDEBAR: () => set((state) => {
        state.sidebarStatus = !state.sidebarStatus
        setCookie('sidebarStatus', state.sidebarStatus ? 1 : 0)
    })
})));

export default appStore;