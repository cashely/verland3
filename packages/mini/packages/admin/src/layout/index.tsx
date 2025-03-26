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
import { getTokenFromLocalStorage } from "@/utils/index.ts";
const Layout = () => {
  const location = useLocation();

  console.log(location.pathname);

  return (
    <section className="flex w-full h-[100vh]">
      <SiderBar />
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <Header />
        <NavBar />
        <section className="bg-[#f5f5f5] h-full p-[16px] overflow-hidden flex-1 child-body flex flex-column">
          {useOutlet()}
        </section>
      </div>
    </section>
  );
};

export default Layout;
