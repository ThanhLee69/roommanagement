import React from "react";
import { Layout, Button, Input, Badge, Avatar, Dropdown } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const { Header } = Layout;

const HeaderBar = ({ collapsed, setCollapsed, userMenuItems, onSearch }) => {
  return (
    <Header
      style={{
        padding: "0 24px",
        background: "#fff",
        borderBottom: "1px solid #e5e5e5",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{ fontSize: 16 }}
        />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* <Badge count={10} overflowCount={99} size="small">
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <BellOutlined style={{ fontSize: 20 }} />
          </div>
        </Badge> */}

        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <a>
            <Avatar
              style={{ backgroundColor: "#87d068", cursor: "pointer" }}
              icon={<UserOutlined />}
            />
          </a>
        </Dropdown>
      </div>
    </Header>
  );
};

export default HeaderBar;
