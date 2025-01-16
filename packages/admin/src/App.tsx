import { useState, useEffect } from "react";
import "./App.css";
import { ConfigProvider, App as AntdApp } from "antd";
import Router from "./router";
//TODO
import useTheme from "@/hooks/themeContext";

function App() {
  const { theme } = useTheme();
  return (
    <ConfigProvider
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
