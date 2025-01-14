import {
  createHashRouter,
  RouterProvider,
  useRoutes,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { Spin } from "antd";
import { constantRoutesList, anyncRoutesList } from "./routes.tsx";
import { getTokenFromLocalStorage } from "../utils/index.ts";

const router = createHashRouter([...anyncRoutesList, ...constantRoutesList]);

const RouterComponent = () => {
  return (
    <RouterProvider router={router} fallbackElement={<Spin />}></RouterProvider>
  );
};
export default RouterComponent;
