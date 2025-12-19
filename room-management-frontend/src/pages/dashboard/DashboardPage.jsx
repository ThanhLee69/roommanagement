import React, { useEffect, useState } from "react";
import { getInvoiceDashboard } from "../../api/invoiceApi";
import { Card, Col, Flex, Row, Statistic } from "antd";
import { formatCurrency } from "../../utils/format-currency";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DollarOutlined,
  RiseOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Button } from "antd/es/radio";
import RoomStatusPieChart from "./RoomStatusPieChart";
import MonthlyRevenueBarChart from "./MonthlyRevenueBarChart";
import RoomStatusSummary from "./InvoicdStatusSummary";

const DashboardPage = () => {
  const [dashboard, setDashboard] = useState({});
  useEffect(() => {
    async function load() {
      const res = await getInvoiceDashboard();
      setDashboard(res.result);
    }
    load();
  }, []);

  const statCardStyle = (color) => ({
    borderLeft: `6px solid ${color}`,
    borderRadius: 8,
    boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
  });

  const roomStatusData = [
    { name: "Phòng trống", value: 23 },
    { name: "Đang thuê", value: 34 },
    { name: "Bảo trì", value: 23 },
  ];
  // const invoiceStatusData = [
  //   { name: "Đã thanh toán", value: 23 },
  //   { name: "Chưa thanh toán", value: 54 },
  //   { name: "Quá hạn", value: 23 },
  // ];
  const monthlyRevenueData = [
    { month: "T1", revenue: 12000000 },
    { month: "T2", revenue: 15000000 },
    { month: "T3", revenue: 18000000 },
    { month: "T4", revenue: 17000000 },
    { month: "T5", revenue: 21000000 },
    { month: "T6", revenue: 25000000 },
    { month: "T7", revenue: 24000000 },
    { month: "T8", revenue: 26000000 },
    { month: "T9", revenue: 23000000 },
    { month: "T10", revenue: 28000000 },
    { month: "T11", revenue: 30000000 },
    { month: "T12", revenue: 35000000 },
  ];

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <div>
          <h1 style={{ marginBottom: 5, fontWeight: 700, color: "#536ee7ff" }}>
            Dashboard
          </h1>
          <h4 style={{ color: "#536ee7ff" }}>
            Tổng quan hệ thống quản lý phòng trọ
          </h4>
        </div>
      </div>
      <Flex vertical gap={30}>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} md={6}>
            <Card
              variant="borderless"
              style={{
                borderTop: "4px solid #1890ff",
                borderRight: "4px solid #1890ff",
                borderRadius: 8,
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
              }}
            >
              <Statistic
                title="Tổng số phòng"
                value={dashboard.totalInvoice}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card
              variant="borderless"
              style={{
                borderTop: "4px solid #52c41a",
                borderRight: "4px solid #52c41a",
                borderRadius: 8,
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
              }}
            >
              <Statistic
                title="Tổng số phòng trống"
                value={dashboard.unpaidInvoice}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card
              variant="borderless"
              style={{
                borderTop: "4px solid #ff4d4f",
                borderRight: "4px solid #ff4d4f",
                borderRadius: 8,
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
              }}
            >
              <Statistic
                title="Hóa đơn quá hạn"
                value={dashboard.overdueInvoice}
                valueStyle={{ color: "#ff4d4f" }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card
              variant="borderless"
              style={{
                borderTop: "4px solid #eec642ff",
                borderRight: "4px solid #eec642ff",
                borderRadius: 8,
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
              }}
            >
              <Statistic
                title="Hợp đồng sắp hết hạn"
                value={formatCurrency(dashboard.outstandingAmount, true)}
                valueStyle={{ color: "#eec642ff" }}
              />
            </Card>
          </Col>
        </Row>
        <Row gutter={{ xs: 16, sm: 24, md: 30 }}>
          {/* Doanh thu tháng */}
          <Col xs={24} sm={12} md={8}>
            <Card bordered={false} style={statCardStyle("#52c41a")}>
              <Statistic
                title="Doanh thu tháng"
                value={11000000}
                valueStyle={{ color: "#52c41a" }}
                formatter={(v) =>
                  `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ"
                }
              />
            </Card>
          </Col>

          {/* Doanh thu năm */}
          <Col xs={24} sm={12} md={8}>
            <Card bordered={false} style={statCardStyle("#1890ff")}>
              <Statistic
                title="Doanh thu năm"
                value={98000000}
                valueStyle={{ color: "#1890ff" }}
                formatter={(v) =>
                  `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ"
                }
              />
            </Card>
          </Col>

          {/* Tổng nợ */}
          <Col xs={24} sm={12} md={8}>
            <Card bordered={false} style={statCardStyle("#ff4d4f")}>
              <Statistic
                title="Tổng nợ"
                value={7200000}
                valueStyle={{ color: "#ff4d4f" }}
                formatter={(v) =>
                  `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ"
                }
              />
            </Card>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <RoomStatusPieChart data={roomStatusData} />
          </Col>
          <Col span={12}>
            <RoomStatusSummary dashboard={dashboard} />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xs={24} md={24}>
            <MonthlyRevenueBarChart data={monthlyRevenueData} />
          </Col>
        </Row>
      </Flex>
    </>
  );
};

export default DashboardPage;
