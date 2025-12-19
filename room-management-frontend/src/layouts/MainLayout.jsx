import React, { useState } from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import HeaderBar from "./components/HeaderBar";
import FooterBar from "./components/FooterBar";

const { Content } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  const userMenuItems = [
    { key: "1", label: "Tài khoản của tôi", disabled: true },
    { type: "divider" },
    { key: "2", label: "Thông tin cá nhân", icon: <></> },
    { key: "4", label: "Cài đặt", icon: <></> },
    { type: "divider" },
    { key: "5", label: "Đăng xuất", danger: true, icon: <></> },
  ];

  const onSearch = (value) => {
    console.log("Search:", value);
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 230,
          transition: "all 0.3s",
          height: "100vh",
        }}
      >
        <HeaderBar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          userMenuItems={userMenuItems}
          onSearch={onSearch}
        />
        <Content
          style={{ padding: 15, overflow: "auto", background: "#f5f7fbff" }}
        >
          <Outlet />
        </Content>
        <FooterBar />
      </Layout>
    </Layout>
  );
};

export default MainLayout;
