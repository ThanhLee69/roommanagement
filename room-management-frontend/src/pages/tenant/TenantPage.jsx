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
  Typography,
  Popconfirm,
  Tooltip,
} from "antd";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  PlusOutlined,
  FormOutlined,
  DeleteOutlined,
  MailOutlined,
  PhoneOutlined,
  WarningOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import {
  deleteTenant,
  getTenantDashboard,
  getTenants,
} from "../../api/tenantApi";
import MyCard from "../../components/MyCard";
import { useNotify } from "../../components/NotificationProvider";
import TenantFrom from "./TenantFrom";
import { GENDER_OPTIONS, TENANT_STATUS_OPTIONS } from "../../constants/labels";
import { FiMapPin } from "react-icons/fi";
const { Option } = Select;

const TenantPage = () => {
  const { notify, contextHolder } = useNotify();

  const [filters, setFilters] = useState({
    keyword: "",
    status: undefined,
  });

  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
  });

  const [tenants, setTenants] = useState({});

  const [loading, setLoading] = useState(false);

  const [modal, setModal] = useState({
    isOpen: false,
    mode: "",
    record: null,
  });

  // === FETCH tenants ===
  const fetchTenants = async () => {
    setLoading(true);
    try {
      const res = await getTenants({
        keyword: filters.keyword,
        status: filters.status,
        page: pagination.page,
        size: pagination.size,
      });
      setTenants(res);
      setPagination({ page: res.currentPage, size: res.pageSize });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
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
  const STATUS_COLOR_MAP = {
    RENTING: "green", // Đang thuê
    CHECKED_OUT: "blue", // Đã trả phòng
    NOT_RENTED: "gray", // Chưa thuê
  };
  const handleDelete = async (id) => {
    try {
      await deleteTenant(id);
      notify({
        type: "success",
        message: "Xóa khách thuê thành công!",
      });
      fetchTenants();
      // loadDashboard();
    } catch (error) {
      notify({
        type: "error",
        message: "Xóa khách thuê thất bại!",
        description:
          error?.response?.data?.message || "Xảy ra lỗi khi xóa khách thuê!",
      });
    }
  };
  // === TABLE COLUMNS ===
  const columns = [
    { title: "Họ tên", dataIndex: "fullName", key: "fullName" },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (text) => (
        <span>
          <PhoneOutlined style={{ marginRight: 6, color: "#1890ff" }} />
          {text}
        </span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => (
        <span>
          <MailOutlined style={{ marginRight: 6, color: "#52c41a" }} />
          {text}
        </span>
      ),
    },
    {
      title: "CCCD",
      dataIndex: "cccd",
      key: "cccd",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (_, record) =>
        GENDER_OPTIONS.find((item) => item.value === record.gender)?.label ||
        "",
    },
    {
      title: "Địa chỉ",
      dataIndex: "permanentAddress",
      key: "permanentAddress",
      render: (text) => (
        <span>
          <FiMapPin style={{ marginRight: 6, color: "#faad14" }} />
          {text}
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (value) => {
        const label =
          TENANT_STATUS_OPTIONS.find((opt) => opt.value === value)?.label ||
          value;
        const color = STATUS_COLOR_MAP[value] || "default";
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: "Phòng hiện tại",
      key: "roomBuilding",
      render: (text, record) => {
        if (!record.roomName && !record.buildingName) return "Chưa thuê";
        return (
          <div>
            <div>Phòng {record.roomName || "-"}</div>
            <div>{record.buildingName || "-"}</div>
          </div>
        );
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
                  <Typography.Text strong>Xóa khách thuê</Typography.Text>
                </div>
                <Typography.Text type="secondary" style={{ fontSize: 14 }}>
                  Bạn có chắc chắn muốn xóa khách thuê này? Tất cả dữ liệu liên
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
  const loadDashboard = async () => {
    try {
      const res = await getTenantDashboard();
      setDashboard(res.result);
    } catch (err) {
      console.error("Lấy dashboard thất bại:", err);
    }
  };
  useEffect(() => {
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
            Quản lý khách thuê
          </h1>
          <h4 style={{ color: "#536ee7ff" }}>
            Danh sách tất cả các khách thuê trong hệ thống
          </h4>
        </div>
        <Button type="primary" onClick={() => showModal("add")}>
          <PlusOutlined /> Thêm khách thuê
        </Button>
      </div>
      <Flex vertical gap={25}>
        {/* Filter */}
        <MyCard title="Tìm kiếm và lọc">
          <Row gutter={24}>
            <Col span={20}>
              <Input
                placeholder="Tìm kiếm theo họ tên, số điện thoại, cccd, địa chỉ..."
                allowClear
                value={filters.keyword}
                onChange={(e) => {
                  setFilters((prev) => ({ ...prev, keyword: e.target.value }));
                }}
                prefix={
                  <SearchOutlined style={{ color: "#aaa", marginRight: 4 }} />
                }
              />
            </Col>
            <Col span={4}>
              <Select
                placeholder="Trạng thái"
                value={filters.status}
                onChange={(val) =>
                  setFilters((prev) => ({ ...prev, status: val }))
                }
                style={{ width: "100%" }}
                allowClear
              >
                {" "}
                {TENANT_STATUS_OPTIONS.map((status) => (
                  <Option key={status.value} value={status.value}>
                    {status.label}
                  </Option>
                ))}
              </Select>
            </Col>
          </Row>
        </MyCard>

        {/* Statistics */}
        <Row gutter={[24, 24]}>
          {/* Tổng số khách */}
          <Col xs={24} sm={12} md={6}>
            <Card
              style={{
                borderTop: "4px solid #1890ff",
                borderRadius: 8,
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
              }}
            >
              <Statistic
                title="Tổng số khách"
                value={dashboard.totalTenants}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>

          {/* Khách đang thuê */}
          <Col xs={24} sm={12} md={6}>
            <Card
              style={{
                borderTop: "4px solid #52c41a",
                borderRadius: 8,
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
              }}
            >
              <Statistic
                title="Khách đang thuê"
                value={dashboard.rentingTenants}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>

          {/* Khách đã trả phòng */}
          <Col xs={24} sm={12} md={6}>
            <Card
              style={{
                borderTop: "4px solid #faad14",
                borderRadius: 8,
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
              }}
            >
              <Statistic
                title="Khách đã trả phòng"
                value={dashboard.checkedOutTenants}
                valueStyle={{ color: "#faad14" }}
              />
            </Card>
          </Col>

          {/* Khách chưa thuê */}
          <Col xs={24} sm={12} md={6}>
            <Card
              style={{
                borderTop: "4px solid #ff4d4f",
                borderRadius: 8,
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
              }}
            >
              <Statistic
                title="Khách chưa thuê"
                value={dashboard.notRentedTenants}
                valueStyle={{ color: "#ff4d4f" }}
              />
            </Card>
          </Col>
        </Row>

        {/* Table */}
        <MyCard title="Danh sách khách thuê">
          <Table
            size="middle"
            columns={columns}
            dataSource={tenants.items}
            rowKey="id"
            loading={loading}
            pagination={false}
          />
          <Pagination
            current={pagination.page}
            pageSize={pagination.size}
            total={tenants.totalItems}
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
        <TenantFrom
          isMode={modal.mode}
          record={modal.record || {}}
          hideModal={hideModal}
          isModal={modal.isOpen}
          fetchTenants={fetchTenants}
          notify={notify}
        />
      )}
    </Fragment>
  );
};

export default TenantPage;
