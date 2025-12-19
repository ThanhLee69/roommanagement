import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import MyCard from "../../components/MyCard";
import { formatCurrency } from "../../utils/format-currency";

const MonthlyRevenueBarChart = ({ data }) => {
  return (
    <MyCard title="Doanh thu theo tháng">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="month" />
          {/* <YAxis tickFormatter={formatVND} /> */}

          <Tooltip
            formatter={(value) => formatCurrency(value, true)}
            contentStyle={{
              borderRadius: 8,
              border: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          />

          <Bar
            dataKey="revenue"
            fill="#1890ff"
            radius={[8, 8, 0, 0]}
            barSize={70}
            activeBar={{ fill: "#1890ff" }}
          />
        </BarChart>
      </ResponsiveContainer>
    </MyCard>
  );
};

export default MonthlyRevenueBarChart;
