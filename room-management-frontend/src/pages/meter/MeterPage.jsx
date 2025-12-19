import React, { Fragment, useEffect, useState } from "react";
import {
  Flex,
  Space,
  Table,
  Input,
  Button,
  Pagination,
  Select,
  Tag,
} from "antd";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  PlusOutlined,
  FormOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { getMeterReadings } from "../../api/meterApi";
import MyCard from "../../components/MyCard";
import { useNotify } from "../../components/NotificationProvider";
import RoomSelect from "../../components/RoomSelect";
import MeterReadingForm from "./MeterForm";

const MeterReadingPage = () => {
  const { notify, contextHolder } = useNotify();
  const [meterReadings, setMeterReadings] = useState({});
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    keyword: "",
    roomId: undefined,
    month: undefined,
    year: undefined,
  });

  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
  });

  const columns = [
    {
      title: "Phòng",
      dataIndex: "roomName",
      key: "roomName",
    },
    {
      title: "Tháng / Năm",
      key: "monthYear",
      render: (_, record) => `Tháng ${record.month}/${record.year}`,
    },
    {
      title: "Số điện cũ → mới",
      key: "electricRange",
      render: (_, record) => `${record.oldElectric} → ${record.newElectric}`,
    },
    {
      title: "Số điện sử dụng",
      dataIndex: "electricUsed",
      key: "electricUsed",
      render: (val) => <Tag color="orange">{val} (kWh)</Tag>,
    },
    {
      title: "Số nước cũ → mới",
      key: "waterRange",
      render: (_, record) => `${record.oldWater} → ${record.newWater}`,
    },
    {
      title: "Số nước sử dụng",
      dataIndex: "waterUsed",
      key: "waterUsed",
      render: (val) => <Tag color="blue">{val} (m³)</Tag>,
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<FormOutlined />}
            onClick={() => showModal("edit", record)}
          />
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Space>
      ),
    },
  ];
  const fetchMeterReadings = async () => {
    setLoading(true);
    try {
      const res = await getMeterReadings({
        keyword: filters.keyword,
        roomId: filters.roomId,
        month: filters.month,
        year: filters.year,
        page: pagination.page,
        size: pagination.size,
      });
      setMeterReadings(res);
      setPagination({ page: res.currentPage, size: res.pageSize });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeterReadings();
  }, [filters, pagination.page, pagination.size]);

  const onPageChange = (newPage) =>
    setPagination((prev) => ({ ...prev, page: newPage - 1 }));
  const onsizeChange = (current, size) =>
    setPagination({ page: 0, size: size });

  const [open, setOpen] = useState({
    isModal: false,
    isMode: "",
    record: null,
  });

  const showModal = (mode, record) => {
    setOpen({
      isModal: true,
      isMode: mode,
      record: record,
    });
  };

  const hideModal = () => {
    setOpen({ isModal: false });
  };
  const years = [];
  for (let y = 2020; y <= 2050; y++) {
    years.push(y);
  }
  return (
    <Fragment>
      {contextHolder}
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
            Quản lý số điện & nước
          </h1>
          <h4 style={{ color: "#536ee7ff" }}>
            Danh sách tất cả số điện & nước trong hệ thống
          </h4>
        </div>
        <Button type="primary" onClick={() => showModal("add")}>
          <PlusOutlined />
          Thêm điện nước
        </Button>
      </div>
      <Flex vertical gap={25}>
        <MyCard title="Tìm kiếm và lọc">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Input
              placeholder="Tìm kiếm theo tên phòng, ghi chú..."
              allowClear
              value={filters.keyword}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, keyword: e.target.value }));
              }}
              style={{ flex: 1 }}
            />

            <div style={{ display: "flex", gap: 12, flex: 1 }}>
              <RoomSelect
                placeholder="Phòng"
                value={filters.roomId}
                onChange={(val) =>
                  setFilters((prev) => ({ ...prev, roomId: val }))
                }
                allowClear
                style={{ flex: 2 }}
              />
              <Select
                placeholder="Tháng"
                value={filters.month}
                onChange={(val) =>
                  setFilters((prev) => ({ ...prev, month: val }))
                }
                allowClear
                style={{ flex: 1 }}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <Select.Option key={m} value={m}>
                    Tháng {m}
                  </Select.Option>
                ))}
              </Select>
              <Select
                placeholder="Năm"
                value={filters.year}
                onChange={(val) =>
                  setFilters((prev) => ({ ...prev, year: val }))
                }
                allowClear
                style={{ flex: 1 }}
              >
                {years.map((year) => (
                  <Select.Option key={year} value={year}>
                    Năm {year}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </div>
        </MyCard>

        <MyCard title="Danh sách điện nước">
          <Table
            size="small"
            columns={columns}
            dataSource={meterReadings.items}
            rowKey="id"
            loading={loading}
            pagination={false}
          />
          <Pagination
            current={pagination.page}
            size={pagination.size}
            total={meterReadings.totalItems}
            showSizeChanger
            sizeOptions={["5", "10", "20", "50"]}
            onChange={onPageChange}
            onShowSizeChange={onsizeChange}
            style={{
              marginTop: 16,
              display: "flex",
              justifyContent: "flex-end",
            }}
          />
        </MyCard>
      </Flex>

      {open.isModal && (
        <MeterReadingForm
          isMode={open.isMode}
          record={open.record || {}}
          hideModal={hideModal}
          isModal={open.isModal}
          fetchMeterReadings={fetchMeterReadings}
          notify={notify}
          setLoading={setLoading}
        />
      )}
    </Fragment>
  );
};
export default MeterReadingPage;
