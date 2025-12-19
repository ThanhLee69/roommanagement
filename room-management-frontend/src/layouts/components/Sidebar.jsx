import React from "react";
import { Menu, Layout } from "antd";
import {
  BankOutlined,
  AppstoreAddOutlined,
  TeamOutlined,
  SnippetsOutlined,
  FileTextOutlined,
  DollarOutlined,
  WarningOutlined,
  SoundOutlined,
  PropertySafetyOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { path_name } from "../../constants/path_name";
import logo from "../../assets/images/logo.png";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { MdPayment } from "react-icons/md";

const { Sider } = Layout;

const Sidebar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { key: path_name.dashboard, icon: <HomeOutlined />, label: "Trang chủ" },
    {
      key: path_name.user,
      icon: <PropertySafetyOutlined />,
      label: "Quản lý tài khoản",
    },
    {
      key: path_name.building,
      icon: <HiOutlineBuildingOffice2 />,
      label: "Tòa nhà",
    },
    { key: path_name.room, icon: <AppstoreAddOutlined />, label: "Phòng" },
    { key: path_name.tenant, icon: <TeamOutlined />, label: "Khách thuê" },
    { key: path_name.contract, icon: <SnippetsOutlined />, label: "Hợp đồng" },
    // {
    //   key: "properties",
    //   icon: <PropertySafetyOutlined />,
    //   label: "Thuộc tính",
    //   children: [
    //     {
    //       key: path_name.meter,
    //       icon: <SnippetsOutlined />,
    //       label: "Điện nước",
    //     },
    //     {
    //       key: path_name.service,
    //       icon: <AppstoreAddOutlined />,
    //       label: "Dịch vụ",
    //     },
    //     {
    //       key: path_name.amenity,
    //       icon: <HomeOutlined />,
    //       label: "Tiện nghi",
    //     },
    //   ],
    // },
    { key: path_name.invoice, icon: <FileTextOutlined />, label: "Hóa đơn" },
    { key: path_name.payment, icon: <MdPayment />, label: "Thanh toán" },
    { key: path_name.issue, icon: <WarningOutlined />, label: "Sự cố" },
    {
      key: path_name.notification,
      icon: <SoundOutlined />,
      label: "Thông báo",
    },
  ];

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={230}
      style={{
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        overflow: "auto",
        background: "#fff",
        borderRight: "1px solid #e5e5e5",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 64,
        }}
      >
        <img
          src={logo}
          width={collapsed ? 60 : 120}
          alt="Logo"
          style={{ transition: "width 0.3s" }}
        />
      </div>
      <Menu
        style={{ borderRight: "none" }}
        items={menuItems}
        mode="inline"
        selectedKeys={[location.pathname]}
        onClick={({ key }) => navigate(key)}
      />
    </Sider>
  );
};

export default Sidebar;
