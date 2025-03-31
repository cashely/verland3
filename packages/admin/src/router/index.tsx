import {
  createHashRouter,
  RouterProvider,
} from "react-router-dom";
import { useEffect } from 'react';
import { Spin } from "antd";
import { constantRoutesList, anyncRoutesList } from "./routes.tsx";
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const router = createHashRouter([...anyncRoutesList, ...constantRoutesList]);

const RouterComponent = () => {
  useEffect(() => {
    // 订阅路由变化事件
    const unsubscribe = router.subscribe((state) => {
      console.log(state, '444');
      // 过滤掉 hashChange 事件（仅处理路径变化）
      if (state.historyAction !== 'POP' || state.location.hash === '') {
        NProgress.start();
      }
    });

    // 初始化完成时关闭进度条
    NProgress.done();

    return () => {
      unsubscribe();
      NProgress.done();
    };
  }, []);

  // 监听导航完成事件
  useEffect(() => {
    const handleComplete = () => NProgress.done();
    router.subscribe(handleComplete);
    return () => router.subscribe(handleComplete);
  }, []);

  return (
    <RouterProvider router={router} fallbackElement={<Spin />}></RouterProvider>
  );
};
export default RouterComponent;
