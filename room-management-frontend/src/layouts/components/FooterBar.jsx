import React from "react";
import { Layout } from "antd";

const { Footer } = Layout;

const FooterBar = () => {
  return (
    <Footer
      style={{
        textAlign: "center",
        background: "#fff",
        borderTop: "1px solid #e5e5e5",
        padding: "10px 0",
        fontSize: 14,
        color: "#666",
      }}
    >
      © {new Date().getFullYear()} Room Management System — Developed by Thanh
      Le
    </Footer>
  );
};

export default FooterBar;
