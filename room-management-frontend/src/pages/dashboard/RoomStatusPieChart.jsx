import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card } from "antd";
import MyCard from "../../components/MyCard";
const COLORS = ["#52c41a", "#1890ff", "#faad14", "#ff4d4f"];

const RoomStatusPieChart = ({ data }) => {
  return (
    <MyCard title="Thống kê phòng">
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip />
          <Legend verticalAlign="bottom" />
        </PieChart>
      </ResponsiveContainer>
    </MyCard>
  );
};

export default RoomStatusPieChart;
