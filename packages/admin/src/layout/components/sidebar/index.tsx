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
    console.log('331', location)
    setInitPath(location.pathname);
  }, [location.pathname]);

  return (
    <aside
      className={`h-full bg-gray-200 sidebar`}
    >
      <h1 className="text-sm text-gray-100">
        <Logo width={50} fontSize={18} />
      </h1>
      <SideMenu initPath={initPath}></SideMenu>
    </aside>
  );
};

export default SiderBar;
