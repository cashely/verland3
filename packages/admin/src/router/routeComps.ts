import loadable from '@loadable/component';
import { getTokenFromLocalStorage } from '@/utils';
//按需加载
const Login = loadable(() => import('../pages/login'));
const Page401 = loadable(() => import('../pages/errorPage/401'));
const Page404 = loadable(() => import('../pages/errorPage/404'));
const Layout = loadable(() => import('../layout'));
const ProjectList = loadable(() => import('../pages/projects/list'));
const MenuManagement = loadable(() => import('../pages/menuManagement'));
const MenuManagementDetail = loadable(
  () => import('../pages/menuManagement/detail.tsx')
);
const AppointManagement = loadable(() => import('../pages/appointManagement'));
const PetManagement = loadable(() => import('../pages/petManagement/index'));
const PetDetail = loadable(() => import('../pages/petManagement/detail'));
const AccountManagement = loadable(() => import('../pages/accountManagement'));
const AppointManagementDetail = loadable(
  () => import('../pages/appointManagement/detail')
);

const BookGoodsManagement = loadable(
  () => import('../pages/bookGoodsManagement')
);
const TickManagement = loadable(() => import('../pages/tickManagement'));
const TickManagementDetail = loadable(
  () => import('../pages/tickManagement/detail.tsx')
);
const AdviceManagement = loadable(() => import('../pages/adviceManagement'));
const AdviceManagementDetail = loadable(
  () => import('../pages/adviceManagement/detail')
);
const BookGoodsDetail = loadable(
  () => import('../pages/bookGoodsManagement/detail')
);
const AccountDetail = loadable(
  () => import('../pages/accountManagement/detail')
);
const StoreManagement = loadable(() => import('../pages/storeManagement'));
const StoreDetail = loadable(() => import('../pages/storeManagement/detail'));

export {
  Login,
  Page401,
  Page404,
  Layout,
  ProjectList,
  MenuManagement,
  MenuManagementDetail,
  AppointManagement,
  PetManagement,
  PetDetail,
  BookGoodsDetail,
  AdviceManagementDetail,
  AccountManagement,
  AppointManagementDetail,
  BookGoodsManagement,
  TickManagement,
  TickManagementDetail,
  AdviceManagement,
  AccountDetail,
  StoreManagement,
  StoreDetail,
}