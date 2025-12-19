import React, { useEffect, useState, Fragment } from "react";
import {
  Flex,
  Space,
  Table,
  Tag,
  Card,
  Col,
  Row,
  Statistic,
  Input,
  Button,
  Pagination,
  Select,
  Tooltip,
  Typography,
  Popconfirm,
} from "antd";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  PlusOutlined,
  FormOutlined,
  DeleteOutlined,
  SearchOutlined,
  WarningOutlined,
} from "@ant-design/icons";

import {
  deleteContract,
  getContractDashboard,
  getContracts,
} from "../../api/contractApi";
import MyCard from "../../components/MyCard";
import { useNotify } from "../../components/NotificationProvider";
import {
  CONTRACT_STATUS_OPTIONS,
  PAYMENT_CYCLE_OPTIONS,
} from "../../constants/labels";
import { formatCurrency } from "../../utils/format-currency";
import { getRooms } from "../../api/roomApi";
import BuildingSelect from "../../components/BuildingSelect";
import RoomSelect from "../../components/RoomSelect";
import ContractForm from "./ContractForm";
const { Option } = Select;

const ContractPage = () => {
  const { notify, contextHolder } = useNotify();
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    keyword: "",
    status: undefined,
    buildingId: undefined,
    roomId: undefined,
  });

  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
  });

  const [contracts, setContracts] = useState({});

  const [modal, setModal] = useState({
    isOpen: false,
    mode: "",
    record: null,
  });

  const fetchContracts = async () => {
    setLoading(true);
    try {
      const res = await getContracts({
        keyword: filters.keyword,
        status: filters.status,
        buildingId: filters.buildingId,
        roomId: filters.roomId,
        page: pagination.page,
        size: pagination.size,
      });
      setContracts(res);
      setPagination({ page: res.currentPage, size: res.pageSize });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [filters, pagination.page, pagination.size]);

  // === PAGINATION HANDLER ===
  const onPageChange = (newPage) =>
    setPagination((prev) => ({ ...prev, page: newPage }));
  const onsizeChange = (current, size) =>
    setPagination({ page: 1, size: size });

  // === MODAL HANDLER ===
  const showModal = (mode, record = null) =>
    setModal({ isOpen: true, mode, record });
  const hideModal = () => setModal({ ...modal, isOpen: false });

  const handleDelete = async (id) => {
    try {
      await deleteContract(id);
      notify({
        type: "success",
        message: "Xóa hợp đồng thành công!",
      });
      fetchContracts();
      // loadDashboard();
    } catch (error) {
      notify({
        type: "error",
        message: "Xóa hợp đồng thất bại!",
        description:
          error?.response?.data?.message || "Xảy ra lỗi khi hợp đồng thuê!",
      });
    }
  };
  // === TABLE COLUMNS ===
  const columns = [
    { title: "Mã hợp đồng", dataIndex: "contractCode", key: "contractCode" },
    {
      title: "Phòng",
      key: "room",
      render: (_, record) => record.room?.roomName || "N/A",
    },
    {
      title: "Người đại diện",
      key: "tenant",
      render: (_, record) => record.tenant?.tenantName || "N/A",
    },
    {
      title: "Thời hạn hợp đồng",
      key: "duration",
      render: (_, record) =>
        `${record.startDate || ""} → ${record.endDate || ""}`,
    },
    {
      title: "Tiền thuê",
      dataIndex: "rentPrice",
      key: "rentPrice",
      render: (_, record) => formatCurrency(record.rentPrice, true),
    },
    {
      title: "Tiền cọc",
      dataIndex: "deposit",
      key: "deposit",
      render: (_, record) => formatCurrency(record.deposit, true),
    },
    {
      title: "Chu kỳ thanh toán",
      dataIndex: "paymentCycle",
      key: "paymentCycle",
      render: (_, record) =>
        PAYMENT_CYCLE_OPTIONS.find((item) => item.value === record.paymentCycle)
          ?.label || "",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (_, record) => {
        const status = CONTRACT_STATUS_OPTIONS.find(
          (item) => item.value === record.status,
        );
        let color = "default";
        if (record.status === "ACTIVE") color = "green";
        else if (record.status === "EXPIRED") color = "red";
        else if (record.status === "DRAFT") color = "blue";
        else if (record.status === "TERMINATED") color = "orange";
        else if (record.status === "CANCELLED") color = "gray";

        return <Tag color={color}>{status?.label || record.status}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Chỉnh sửa">
            <Button
              icon={<FormOutlined />}
              onClick={() => showModal("edit", record)}
            />
          </Tooltip>
          <Popconfirm
            icon={null}
            title={
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <WarningOutlined style={{ color: "red", fontSize: 17 }} />
                  <Typography.Text strong>Xóa hợp đồng</Typography.Text>
                </div>
                <Typography.Text type="secondary" style={{ fontSize: 14 }}>
                  Bạn có chắc chắn muốn xóa hợp đồng này? Tất cả dữ liệu liên
                  quan sẽ mất và không thể khôi phục!
                </Typography.Text>
              </div>
            }
            okText="Xóa"
            okButtonProps={{ danger: true }}
            cancelText="Hủy"
            onConfirm={() => handleDelete(record.id)}
            placement="topRight"
            overlayStyle={{ maxWidth: 300 }}
          >
            <Tooltip title="Xóa">
              <Button icon={<DeleteOutlined />} danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  const [dashboard, setDashboard] = useState({});

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await getContractDashboard();
        setDashboard(res.result);
      } catch (err) {
        console.error("Lấy dữ liệu dashboard thất bại:", err);
      }
    }
    loadDashboard();
  }, []);
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
            Quản lý hợp đồng
          </h1>
          <h4 style={{ color: "#536ee7ff" }}>
            Danh sách tất cả các hợp đồng trong hệ thống
          </h4>
        </div>
        <Button type="primary" onClick={() => showModal("add")}>
          <PlusOutlined /> Thêm hợp đồng
        </Button>
      </div>
      <Flex vertical gap={25}>
        {/* Filter */}

        <MyCard title="Tìm kiếm và lọc">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Input
              placeholder="Tìm kiếm theo mã hợp đồng, tên khách thuê,..."
              allowClear
              value={filters.keyword}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, keyword: e.target.value }));
              }}
              prefix={
                <SearchOutlined style={{ color: "#aaa", marginRight: 4 }} />
              }
              style={{ flex: 1 }}
            />

            <div style={{ display: "flex", gap: 12, flex: 1 }}>
              <Select
                placeholder="Trạng thái"
                value={filters.status}
                onChange={(val) =>
                  setFilters((prev) => ({ ...prev, status: val }))
                }
                allowClear
                style={{ flex: 1 }}
                options={CONTRACT_STATUS_OPTIONS}
              ></Select>

              <BuildingSelect
                placeholder="Tòa nhà"
                value={filters.buildingId}
                onChange={(val) =>
                  setFilters((prev) => ({ ...prev, buildingId: val }))
                }
                style={{ flex: 1 }}
              />

              <RoomSelect
                placeholder="Phòng"
                value={filters.roomId}
                onChange={(val) =>
                  setFilters((prev) => ({ ...prev, roomId: val }))
                }
                allowClear
                style={{ flex: 1 }}
              />
            </div>
          </div>
        </MyCard>

        {/* Statistics */}
        <Row gutter={[24, 24]}>
          {/* Tổng số hợp đồng */}
          <Col xs={24} sm={12} md={6}>
            <Card
              style={{
                borderTop: "4px solid #1890ff",
                borderRadius: 8,
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
              }}
            >
              <Statistic
                title="Tổng số hợp đồng"
                value={dashboard.totalContracts}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>

          {/* Hợp đồng đang hiệu lực */}
          <Col xs={24} sm={12} md={6}>
            <Card
              style={{
                borderTop: "4px solid #52c41a",
                borderRadius: 8,
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
              }}
            >
              <Statistic
                title="Hợp đồng đang hiệu lực"
                value={dashboard.activeContracts}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>

          {/* Hợp đồng sắp hết hạn */}
          <Col xs={24} sm={12} md={6}>
            <Card
              style={{
                borderTop: "4px solid #faad14",
                borderRadius: 8,
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
              }}
            >
              <Statistic
                title="Hợp đồng sắp hết hạn"
                value={dashboard.expiringSoonContracts}
                valueStyle={{ color: "#faad14" }}
              />
            </Card>
          </Col>

          {/* Hợp đồng hết hạn */}
          <Col xs={24} sm={12} md={6}>
            <Card
              style={{
                borderTop: "4px solid #ff4d4f",
                borderRadius: 8,
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
              }}
            >
              <Statistic
                title="Hợp đồng hết hạn"
                value={dashboard.expiredContracts}
                valueStyle={{ color: "#ff4d4f" }}
              />
            </Card>
          </Col>
        </Row>

        {/* Table */}
        <MyCard title="Danh sách hợp đồng">
          <Table
            size="small"
            columns={columns}
            dataSource={contracts.items}
            rowKey="id"
            loading={loading}
            pagination={false}
          />
          <Pagination
            current={pagination.page}
            pageSize={pagination.size}
            total={contracts.totalItems}
            showSizeChanger
            pageSizeOptions={["5", "10", "20", "50"]}
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
      {modal.isOpen && (
        <ContractForm
          isMode={modal.mode}
          record={modal.record}
          hideModal={hideModal}
          isModal={modal.isOpen}
          fetchContracts={fetchContracts}
          notify={notify}
        />
      )}
    </Fragment>
  );
};

export default ContractPage;
