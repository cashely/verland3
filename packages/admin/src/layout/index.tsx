import { useEffect } from "react";
import {
  useOutlet,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import Header from "./components/header";
import SiderBar from "./components/sidebar";
import NavBar from "./components/navbar";
import { getTokenFromLocalStorage } from "../utils/index.ts";
const Layout = () => {
  const token = getTokenFromLocalStorage();
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (token) {
      // 有 token 跳转到首页
      navigate("/");
    } else {
      // 没有 token 跳转到登录页
      navigate("/login");
    }
  }, [navigate]);
  console.log(location.pathname);

  return (
    <section className="flex w-full h-[100vh]">
      <SiderBar />
      <div className="flex flex-col flex-1 h-full">
        <Header />
        <NavBar />
        <section className="h-full p-[16px] overflow-hidden flex-1 child-body">
          {useOutlet()}
        </section>
      </div>
    </section>
  );
};

export default Layout;
