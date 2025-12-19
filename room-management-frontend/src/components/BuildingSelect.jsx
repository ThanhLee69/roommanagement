// src/components/BuildingSelect.js
import React, { useState, useEffect } from "react";
import { Select, Spin } from "antd";
import { getBuildingAll } from "../api/buildingApi";

const BuildingSelect = ({
  placeholder = "Chọn tòa nhà",
  value,
  onChange,
  style,
}) => {
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBuildings = async () => {
    try {
      setLoading(true);
      const data = await getBuildingAll();
      setBuildings(data);
    } catch (error) {
      console.error("Lấy danh sách tòa nhà thất bại", error);
      setBuildings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuildings();
  }, []);

  return (
    <Select
      showSearch
      allowClear
      value={value}
      placeholder={placeholder}
      style={style}
      onChange={onChange}
      filterOption={(input, option) =>
        option.children.toLowerCase().includes(input.toLowerCase())
      }
      loading={loading}
      notFoundContent={loading ? <Spin size="small" /> : "Không có tòa nhà"}
    >
      {buildings.map((b) => (
        <Select.Option key={b.id} value={b.id}>
          {b.name}
        </Select.Option>
      ))}
    </Select>
  );
};

export default BuildingSelect;
