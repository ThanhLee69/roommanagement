// src/components/TenantSelect.js
import React, { useState, useEffect } from "react";
import { Select, Spin } from "antd";
import { getAvailableTenants } from "../api/tenantApi";

const TenantSelect = ({ placeholder = "Chọn người thuê", value, onChange }) => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        setLoading(true);
        const data = await getAvailableTenants();
        setTenants(data);
      } catch (error) {
        console.error("Lấy danh sách người thuê thất bại", error);
        setTenants([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTenants();
  }, []);

  // Filter frontend
  const filteredTenants = tenants.filter((t) =>
    t.fullName.toLowerCase().includes(searchValue.toLowerCase()),
  );

  return (
    <Select
      showSearch
      allowClear
      value={value}
      placeholder={placeholder}
      style={{ width: "100%" }}
      onChange={onChange}
      onSearch={(val) => setSearchValue(val)}
      filterOption={false}
      loading={loading}
      notFoundContent={loading ? <Spin size="small" /> : "Không có người thuê"}
    >
      {filteredTenants.map((t) => (
        <Select.Option key={t.id} value={t.id}>
          {t.fullName}
        </Select.Option>
      ))}
    </Select>
  );
};

export default TenantSelect;
