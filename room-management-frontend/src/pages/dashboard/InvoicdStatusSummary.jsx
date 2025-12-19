import React from "react";
import { Card, Divider } from "antd";

const RoomStatusSummary = ({ dashboard }) => {
  const total =
    (dashboard.availableRooms || 0) +
    (dashboard.occupiedRooms || 0) +
    (dashboard.maintenanceRooms || 0);
  const ROOM_STATUS_CONFIG = [
    {
      key: "AVAILABLE",
      label: "Đã thanh toán",
      color: " #1890ff",
      valueKey: "availableRooms",
    },
    {
      key: "OCCUPIED",
      label: "Thanh toán một phần",
      color: "#52c41a",
      valueKey: "occupiedRooms",
    },
    {
      key: "MAINTENANCE",
      label: "Quá hạn",
      color: "#faad14",
      valueKey: "maintenanceRooms",
    },
    {
      key: "MAINTENANCE",
      label: "Quá hạn",
      color: "#faad14",
      valueKey: "maintenanceRooms",
    },
  ];
  return (
    <Card
      title="Thống kê hóa đơn"
      extra={<span style={{ color: "#888" }}>Tình trạng hóa đơn</span>}
      style={{
        borderRadius: 10,
        boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
        height: 320,
      }}
    >
      {ROOM_STATUS_CONFIG.map((item) => (
        <div
          key={item.key}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 15,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: item.color,
                display: "inline-block",
              }}
            />
            <span>{item.label}</span>
          </div>

          <strong>{dashboard[item.valueKey] || 0}</strong>
        </div>
      ))}

      <Divider style={{ margin: "12px 0" }} />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontWeight: 600,
        }}
      >
        <span>Tổng cộng</span>
        <span>{total}</span>
      </div>
    </Card>
  );
};

export default RoomStatusSummary;
