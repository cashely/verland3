import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Layout } from "antd";
import { anyncRoutesList } from "../../../../router/routes";
import { isExternal } from "../../../../utils/validate";
import "./index.module.scss";
import appStore from '@/store/app'

const { Sider } = Layout;
function SideMenu(props) {
  const {
    theme = "dark",
    mode = "inline",
    initPath = "", //默认展示路由
  } = props;
  const { sidebarStatus } = appStore()
  const navigate = useNavigate()
  const [defaultOpenKeys, setDefaultOpenKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [menuList, setMenuList] = useState([]);

  const isLink = (to: string) => {
    return isExternal(to) || !to.startsWith("/");
  };
  const menuLink = (url: string, title: string) => {
    if (isLink(url)) {
      return (
        <a href={url} target={"_blank"} rel="noreferrer">
          {" "}
          {title}{" "}
        </a>
      );
    } else {
      return <Link to={url}> {title} </Link>;
    }
  };

  // 递归routerList，设置label children 等
  const changeRoutes = (routers = []) => {
    if (!routers || !routers.length) {
      return null;
    }
    const list = routers.filter((v) => v.title);
    return list.map((item: any) => {
      const { children } = item;
      const obj = {
        ...item,
        label: menuLink(item.path, item.title),
        key: item.path,
        icon: item.icon,
      };

      // 过滤隐藏的子路由
      const showingChildren = children?.filter((v) => !v.hidden);
      if (showingChildren && showingChildren?.length) {
        obj.children = changeRoutes(showingChildren);
      } else {
        // alert("没有子路由");
        delete obj.children;
      }
      return obj;
    });
  };

  const initMenu = (list: any) => {
    const _list = changeRoutes(list);
    const newList = _list ? [...changeRoutes(list)] : [];
    setMenuList(newList);
  };

  useEffect(() => {
    initMenu(anyncRoutesList);
    console.log("----------------------", menuList);
  }, []);

  useEffect(() => {
    initActiveMenu();
    console.log("-----------2-----------", initPath);
  }, [menuList]);

  // 初始化需展开的导航 和 高亮当前路径的导航
  const initActiveMenu = () => {
    const rank = initPath.split("/");
    console.log(rank, "rank");
    const len = rank.length;
    const openMenus = [initPath];
    const selectedOpenMenus = [];
    const index = len - 2;
    if (len > 0) {
      for (let i = 0; i < index + 1; i++) {
        if (i < index) {
          selectedOpenMenus.push(rank.slice(0, i + 2).join("/"));
        }
      }
    }
    //默认打开菜单
    setDefaultOpenKeys(selectedOpenMenus);
    setSelectedKeys(openMenus);
  };

  const handleOpenChange = (openKeys: string[]) => {
    console.log(openKeys)
    setDefaultOpenKeys(openKeys)
  }

  const handleSelectKeys = ({ key, keyPath, selectedKeys }) => {
    console.log(key, keyPath, selectedKeys, '++++')
    setSelectedKeys([key])
    navigate(key)
  }

  return (
    <section className="h-full bg-[#001529] pt-[10px]">
      <Sider  collapsed={!sidebarStatus}>
        {/* 可以放logo */}
        <Menu
          theme={theme}
          mode={mode}
          openKeys={defaultOpenKeys}
          selectedKeys={selectedKeys}
          items={menuList}
          onOpenChange={handleOpenChange}
          onSelect={handleSelectKeys}
        />
      </Sider>
    </section>
  );
}

export default SideMenu;
