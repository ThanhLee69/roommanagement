// src/components/RoomSelect.js
import React, { useState, useEffect } from "react";
import { Select, Spin } from "antd";
import { getAvailableRooms } from "../api/roomApi";

const RoomSelect = ({ placeholder = "Chọn phòng", style, ...props }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const data = await getAvailableRooms();
        setRooms(data);
      } catch (error) {
        console.error("Lấy danh sách phòng thất bại", error);
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const filteredRooms = rooms.filter((r) =>
    r.name.toLowerCase().includes(searchValue.toLowerCase()),
  );

  return (
    <Select
      {...props}
      labelInValue
      showSearch
      allowClear
      placeholder={placeholder}
      style={{ width: "100%", ...style }}
      optionFilterProp="label"
      onSearch={setSearchValue}
      filterOption={false}
      loading={loading}
      notFoundContent={loading ? <Spin size="small" /> : "Không có phòng"}
    >
      {filteredRooms.map((r) => (
        <Select.Option
          key={r.id}
          value={r.id}
          label={r.name} // 🔥 QUAN TRỌNG
        >
          {r.name}
        </Select.Option>
      ))}
    </Select>
  );
};

export default RoomSelect;
