import { lazy } from 'react';
import loadable from '@loadable/component';
import { Navigate } from 'react-router-dom';
import { TeamOutlined, CustomerServiceOutlined } from '@ant-design/icons';
import { getTokenFromLocalStorage } from '../utils/index.ts';
import IcontFont from '@/components/IcontFont';
import useUrlQuery from '../hooks/useUrlQuery.ts';
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
const hasToken = getTokenFromLocalStorage();
const BookGoodsDetail = loadable(
  () => import('../pages/bookGoodsManagement/detail')
);
const AccountDetail = loadable(
  () => import('../pages/accountManagement/detail')
);
console.log('🚀 ~ hasToken:', hasToken);
// const AuthComponent = ({ children }: Props) => {
//   // 检查权限是否通过的逻辑
//   console.log("🚀 ~ hasToken:", hasToken);

//   if (!hasToken) {
//     // 检查失败, 跳转登录页
//     return <Navigate to="/login"></Navigate>;
//   }
//   // 检查成功, 展示内容
//   return <>{children}</>;
// };
const constantRoutesList = [
  {
    path: '/login',
    element: <Login />,
    handle: {
      title: '登录',
    },
    // loader: () => {
    //   // alert(1);
    //   return hasToken ? redirect("/dashboard") : null;
    //   // return false;
    // },
  },

  {
    path: '/401',
    element: <Page401 />,
  },
  {
    path: '/404',
    element: <Page404 />,
  },
];

const anyncRoutesList = [
  {
    path: '/',
    errorelement: <Page404 />,
    element: <Layout />,
    title: '首页',
    icon: <IcontFont type="icon-dashboard"></IcontFont>,
    handle: {
      title: '首页',
    },
    children: [
      {
        hidden: true,
        // index: true,
        path: '/dashboard',
        element: <ProjectList />,
        handle: {
          title: '首页',
        },
      },
      //重定向
      {
        hidden: true,
        index: true,

        element: <Navigate to="/dashboard" />,
      },
    ],
  },
  {
    path: '/menuManagement',
    title: '套餐管理',
    element: <Layout />,
    icon: <IcontFont type="icon-yuyueguanli"></IcontFont>,
    handle: { title: '套餐管理' },
    redirect: '/a',
    children: [
      {
        index: true,
        path: '/menuManagement/list',
        title: '列表',
        handle: {
          title: '列表',
        },
        element: <MenuManagement />,
      },
      {
        path: '/menuManagement/detail/:id',
        title: '套餐详情',
        handle: {
          title: '套餐详情',
        },
        hidden: true,
        element: <MenuManagementDetail />,
      },
    ],
  },
  {
    path: '/appointManagement',
    title: '预约管理',
    element: <Layout />,
    icon: <IcontFont type="icon-yuyueguanli"></IcontFont>,
    handle: { title: '预约管理' },
    redirect: '/a',
    children: [
      {
        index: true,
        path: '/appointManagement/list',
        title: '列表',
        handle: {
          title: '列表',
        },
        element: <AppointManagement />,
        //lazy(),
      },
      {
        path: '/appointManagement/detail/:id',
        title: '预约详情',
        handle: {
          title: '预约详情',
        },
        hidden: true,
        element: <AppointManagementDetail />,
        //lazy(),
      },
    ],
  },
  {
    path: '/ticketManagement',
    title: '发票管理',
    element: <Layout />,
    icon: <IcontFont type="icon-fapiaoguanli"></IcontFont>,
    handle: { title: '发票管理' },
    children: [
      {
        path: '/ticketManagement/list',
        title: '列表',
        handle: {
          title: '列表',
        },
        element: <TickManagement />,
      },
      {
        path: '/ticketManagement/detail/:id?',
        title: '详情',
        hidden: true,
        handle: {
          title: '详情',
        },
        element: <TickManagementDetail />,
      },
    ],
  },
  {
    path: '/bookGoodsManagement',
    title: '附加服务管理',
    element: <Layout />,
    icon: <IcontFont type="icon-fujiafuwu1"></IcontFont>,
    handle: { title: '附加服务管理' },
    children: [
      {
        path: '/bookGoodsManagement/list',
        title: '列表',
        handle: {
          title: '列表',
        },
        element: <BookGoodsManagement />,
      },
      {
        path: '/bookGoodsManagement/detail/:id?',
        title: '详情',
        hidden: true,
        handle: {
          title: '详情',
        },
        element: <BookGoodsDetail />,
      },
    ],
  },
  {
    path: '/adviceManagement',
    title: '投诉建议',
    element: <Layout />,
    icon: <IcontFont type="icon-advice" />,
    handle: { title: '投诉建议' },
    children: [
      {
        path: '/adviceManagement/list',
        title: '列表',
        handle: {
          title: '列表',
        },
        element: <AdviceManagement />,
      },
      {
        path: '/adviceManagement/detail/:id?',
        title: '详情',
        hidden: true,
        handle: {
          title: '详情',
        },
        element: <AdviceManagementDetail />,
      },
    ],
  },
  {
    path: '/petManagement',
    title: '宠物管理',
    element: <Layout />,
    icon: (
      <CustomerServiceOutlined
        style={{
          fontSize: 16,
        }}
      />
    ),
    handle: { title: '宠物管理' },
    children: [
      {
        path: '/petManagement/list',
        title: '宠物库',
        handle: {
          title: '宠物库',
        },
        element: <PetManagement />,
      },
      {
        path: '/petManagement/detail/:id?',
        title: '详情',
        hidden: true,
        handle: {
          title: '详情',
        },
        element: <PetDetail />,
      },
    ],
  },
  {
    path: '/accountManagement',
    title: '账号管理',
    element: <Layout />,
    icon: (
      <TeamOutlined
        style={{
          fontSize: 16,
        }}
      />
    ),
    handle: { title: '账号管理' },
    children: [
      {
        path: '/accountManagement/list',
        handle: {
          title: '列表',
        },
        title: '列表',
        element: <AccountManagement />,
      },
      {
        path: '/accountManagement/detail/:id?',
        handle: {
          title: '详情',
        },
        hidden: true,
        title: '详情',
        element: <AccountDetail />,
      },
    ],
  },
];

export { anyncRoutesList, constantRoutesList };
