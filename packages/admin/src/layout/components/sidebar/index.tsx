import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Logo from "./logo";
import SideMenu from "./menus";
const SiderBar = () => {
  const [initPath, setInitPath] = useState("");
  const location = useLocation();

  useEffect(() => {
    setInitPath(location.pathname);
  }, [location.pathname]);

  return (
    <aside
      className="w-[200px] h-full bg-gray-200 sidebar"
      style={{ minWidth: 200 }}
    >
      <h1 className="text-sm text-gray-100">
        <Logo width={30} fontSize={18} />
      </h1>{" "}
      {location.pathname}
      <SideMenu initPath={initPath}></SideMenu>
    </aside>
  );
};

export default SiderBar;
