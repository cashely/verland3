import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Logo from "./logo";
import SideMenu from "./menus";
import appStore from '@/store/app'
const SiderBar = () => {
  const [initPath, setInitPath] = useState("");
  const location = useLocation();
  const { sidebarStatus } = appStore()
  useEffect(() => {
    setInitPath(location.pathname);
  }, [location.pathname]);

  return (
    <aside
      className={`h-full bg-gray-200 sidebar ${sidebarStatus ? 'w-[200px]' : 'w-[80px]'}`}

      style={{ minWidth: sidebarStatus ? 200 : 80 }}
    >
      <h1 className="text-sm text-gray-100">
        <Logo width={30} fontSize={18} />
      </h1>
      <SideMenu initPath={initPath}></SideMenu>
    </aside>
  );
};

export default SiderBar;
