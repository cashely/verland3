import { lazy } from "react";
import loadable from "@loadable/component";
import { Navigate, redirect } from "react-router-dom";
import { InfoCircleOutlined } from '@ant-design/icons';
import { getTokenFromLocalStorage } from "../utils/index.ts";
import IcontFont from "@/components/IcontFont";
import useUrlQuery from "../hooks/useUrlQuery.ts";
//按需加载
const Login = loadable(() => import("../pages/login"));
const Page401 = loadable(() => import("../pages/errorPage/401"));
const Page404 = loadable(() => import("../pages/errorPage/404"));
const Layout = loadable(() => import("../layout"));
const ProjectList = loadable(() => import("../pages/projects/list"));
const AppointManagement = loadable(() => import("../pages/appointManagement"));
const SaleManagement = loadable(() => import("../pages/saleManagement"));
const AccountManagement = loadable(() => import("../pages/accountManagement"));
const AppointManagementDetail = loadable(() => import("../pages/appointManagement/detail"));
const EditOrAdd = loadable(() => import("../pages/appointManagement/editOrAdd"));
const BookGoodsManagement = loadable(() => import("../pages/bookGoodsManagement"));
const TickManagement = loadable(() => import("../pages/tickManagement"));
const AdviceManagement = loadable(() => import("../pages/adviceManagement"));
const hasToken = getTokenFromLocalStorage();
console.log("🚀 ~ hasToken:", hasToken);
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
    path: "/login",
    element: <Login />,
    handle: {
      title: "登录",
    },
    // loader: () => {
    //   // alert(1);
    //   return hasToken ? redirect("/dashboard") : null;
    //   // return false;
    // },
  },

  {
    path: "/401",
    element: <Page401 />,
  },
  {
    path: "/404",
    element: <Page404 />,
  },
];

const anyncRoutesList = [
  {
    path: "/",
    element: <Layout />,
    title: "首页",
    icon:<IcontFont type="icon-dashboard"></IcontFont>,
    handle: {
      title: "首页",
    },
    children: [
      {
        hidden: true,
        // index: true,
        path: "/dashboard",
        element: <ProjectList />,
        handle: {
          title: "首页",
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
    path: "/appointManagement",
    title: "预约管理",
    element: <Layout />,
    icon: <IcontFont type="icon-yuyueguanli"></IcontFont>,
    handle: { title: "预约管理" },
    redirect: "/a",
    children: [
      {
        index: true,
        path: "/appointManagement/list",
        title: "列表",
        handle: {
          title: "列表",
        },
        element: <AppointManagement />,
        //lazy(),
      },
      {
        path: "/appointManagement/detail/:id",
        title: "预约详情",
        handle: {
          title: "预约详情",
        },
        hidden: true,
        element: <AppointManagementDetail />,
        //lazy(),
      },
      {
        path: "/appointManagement/editAdd/:id?",
        title: "预约编辑",  //编辑或者新增
        handle: {
          title: "预约编辑",
        },
        hidden: true,
        element: <EditOrAdd />,
        //lazy(),
        loader: (e) => {
          console.log(e, '-111')
          // alert(1);
          // return hasToken ? redirect("/dashboard") : null;
          // return false;
          return null
        },
      },
    ],
  },
  {
    path: "/ticketManagement",
    title: "发票管理",
    element: <Layout />,
    icon: <IcontFont type="icon-fapiaoguanli"></IcontFont>,
    handle: { title: "发票管理" },
    children: [
      {
        path: "/ticketManagement/list",
        title: "列表",
        handle: {
          title: "列表",
        },
        element: <TickManagement />,
      },
    ],
  },
  {
    path: "/bookGoodsManagement",
    title: "附加服务管理",
    element: <Layout />,
    icon: <IcontFont type="icon-fujiafuwu1"></IcontFont>,
    handle: { title: "附加服务管理" },
    children: [
      {
        path: "/bookGoodsManagement/list",
        title: "列表",
        handle: {
          title: "列表",
        },
        element: <BookGoodsManagement />,
      },
    ],
  },
  {
    path: "/adviceManagement",
    title: "投诉建议",
    element: <Layout />,
    icon: <IcontFont type='icon-advice' />,
    handle: { title: "投诉建议" },
    children: [
      {
        path: "/adviceManagement/list",
        title: "列表",
        handle: {
          title: "列表",
        },
        element: <AdviceManagement />,
      },
    ],
  },
  {
    path: "/saleManagement",
    title: "售后管理",
    element: <Layout />,
    icon: "icon2",
    handle: { title: "售后管理" },
    children: [
      {
        path: "/saleManagement/list",
        title: "列表",
        handle: {
          title: "列表",
        },
        element: <SaleManagement />,
      },
    ],
  },
  {
    path: "/accountManagement",
    title: "账号管理",
    element: <Layout />,
    icon: "icon2",
    handle: { title: "账号管理" },
    children: [
      {
        path: "/accountManagement/list",
        handle: {
          title: "列表",
        },
        title: "列表",
        element: <AccountManagement />,
      },
    ],
  },
];

export { anyncRoutesList, constantRoutesList };
