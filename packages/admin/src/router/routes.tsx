import { lazy } from "react";
import loadable from "@loadable/component";
import { Navigate, redirect } from "react-router-dom";
//按需加载
const Login = loadable(() => import("../pages/login"));
const Page401 = loadable(() => import("../pages/errorPage/401"));
const Page404 = loadable(() => import("../pages/errorPage/404"));
const Layout = loadable(() => import("../layout"));
const ProjectList = loadable(() => import("../pages/projects/list"));
const AppointManagement = loadable(() => import("../pages/appointManagement"));
const SaleManagement = loadable(() => import("../pages/saleManagement"));
const AccountManagement = loadable(() => import("../pages/accountManagement"));

import { getTokenFromLocalStorage } from "../utils/index.ts";
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
    handle: {
      title: "首页",
    },
    children: [
      {
        hidden: true,
        index: true,
        // path: "/dashboard",
        element: <ProjectList />,
        handle: {
          title: "首页",
        },
      },
      //重定向
      // {
      //   hidden: true,
      //   index: true,
      //   element: <Navigate to="/dashboard" />,
      // },
    ],
  },
  {
    path: "/appointManagement",
    title: "预约管理",
    element: <Layout />,
    icon: "icon2",
    handle: { title: "预约管理" },
    children: [
      {
        path: "/appointManagement/list",
        title: "列表",
        handle: {
          title: "列表",
        },
        element: <AppointManagement />,
        //lazy(),
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
