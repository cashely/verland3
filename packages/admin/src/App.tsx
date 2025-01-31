import { useState, useEffect } from "react";
import "./App.css";
import { ConfigProvider, App as AntdApp } from "antd";
import zhCN from "antd/es/locale/zh_CN"; // 引入中文配置
import Router from "./router";
//TODO
import useTheme from "@/hooks/themeContext";

function App() {
  const customLocale = {
    ...zhCN,
    Pagination: {
      ...zhCN.Pagination,
      items_per_page: "/页", // 修改分页显示文案
    },
  };
  const { theme } = useTheme();
  return (
    <ConfigProvider
      locale={customLocale}
      theme={{
        token: {
          borderRadius: 0,
          borderRadiusLG: 0,
          borderRadiusSM: 0,
          colorPrimary: theme.primary,
          fontSize: 12,
          colorLink: theme.primary,
          colorText: "#666",
        },
      }}
    >
      <AntdApp>
        <Router />
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;
