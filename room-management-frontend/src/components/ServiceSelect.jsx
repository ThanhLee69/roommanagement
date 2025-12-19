import React, { useState, useEffect } from "react";
import { Select, Spin } from "antd";
import { getServiceAll } from "../api/serviceApi";

const ServiceSelect = ({ placeholder = "Chọn dịch vụ", value, onChange }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await getServiceAll();
        console.log(data);
        setServices(data);
      } catch (error) {
        console.error("Lấy danh sách dịch vụ thất bại", error);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Filter frontend
  const filteredservices = services.filter((t) =>
    t.name.toLowerCase().includes(searchValue.toLowerCase()),
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
      notFoundContent={loading ? <Spin size="small" /> : "Không có dịch vụ"}
    >
      {filteredservices.map((t) => (
        <Select.Option key={t.id} value={t.id}>
          {t.name}
        </Select.Option>
      ))}
    </Select>
  );
};

export default ServiceSelect;
