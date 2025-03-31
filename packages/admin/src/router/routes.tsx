
import { Navigate } from 'react-router-dom';
import { TeamOutlined, CustomerServiceOutlined } from '@ant-design/icons';
import IcontFont from '@/components/IcontFont';
import {
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
  AccountManagement,
  AppointManagementDetail,
  BookGoodsManagement,
  TickManagement,
  TickManagementDetail,
  AdviceManagement,
  AdviceManagementDetail,
  BookGoodsDetail,
  AccountDetail
} from './routeComps.ts'

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
        element: <Navigate to="/appointManagement/list" />,
      },
    ],
  },
  {
    path: '/appointManagement',
    title: '预约管理',
    element: <Layout />,
    icon: <IcontFont type="icon-yuyueguanli"></IcontFont>,
    handle: { title: '预约管理' },
    //redirect: '/appointManagement/list',
    children: [
      {

        path: '/appointManagement/list',
        title: '预约列表',
        handle: {
          title: '预约列表',
        },
        element: <AppointManagement />,
      },
      {
        path: '/appointManagement/detail/:id',
        title: '预约详情',
        handle: {
          title: '预约详情',
        },
        hidden: true,
        element: <AppointManagementDetail />,
      },
      {
        index: true,
        element: <Navigate to="/appointManagement/list" />,
      }
    ],
  },
  {
    path: '/menuManagement',
    title: '套餐管理',
    element: <Layout />,
    icon: <IcontFont type="icon-yuyueguanli"></IcontFont>,
    handle: { title: '套餐管理' },
    redirect: '/menuManagement/list',
    children: [
      {
        index: true,
        path: '/menuManagement/list',
        title: '套餐列表',
        handle: {
          title: '套餐列表',
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
      {
        index: true,
        element: <Navigate to="/menuManagement/list" />,
      }
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
        title: '发票列表',
        handle: {
          title: '发票列表',
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
      {
        index: true,
        element: <Navigate to="/ticketManagement/list" />,
      }
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
        title: '附加服务列表',
        handle: {
          title: '附加服务列表',
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
      {
        index: true,
        element: <Navigate to="/bookGoodsManagement/list" />,
      }
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
        title: '投诉列表',
        handle: {
          title: '投诉列表',
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
      {
        index: true,
        element: <Navigate to="/adviceManagement/list" />,
      }
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
        title: '宠物列表',
        handle: {
          title: '宠物列表',
        },
        element: <PetManagement />,
      },
      {
        path: '/petManagement/detail/:id',
        title: '详情',
        hidden: true,
        handle: {
          title: '详情',
        },
        element: <PetDetail />,
      },
      {
        index: true,
        element: <Navigate to="/petManagement/list" />,
      }
    ],
  },
  {
    path: '/accountManagement',
    title: '客户管理',
    element: <Layout />,
    icon: (
      <TeamOutlined
        style={{
          fontSize: 16,
        }}
      />
    ),
    handle: { title: '客户管理' },
    children: [
      {
        path: '/accountManagement/list',
        handle: {
          title: '客户列表',
        },
        title: '客户列表',
        element: <AccountManagement />,
      },
      {
        path: '/accountManagement/detail/:id',
        handle: {
          title: '详情',
        },
        hidden: true,
        title: '详情',
        element: <AccountDetail />,
      },
      {
        index: true,
        element: <Navigate to="/accountManagement/list" />,
      }
    ],
  },
];

export { anyncRoutesList, constantRoutesList };
