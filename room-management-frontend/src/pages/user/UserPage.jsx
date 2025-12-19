import React, { Fragment, useEffect, useState } from "react";

import {
  Flex,
  Space,
  Table,
  Tag,
  Input,
  Button,
  Pagination,
  Popconfirm,
  Typography,
  Tooltip,
  Select,
  Col,
  Row,
} from "antd";
import {
  PlusOutlined,
  FormOutlined,
  DeleteOutlined,
  SearchOutlined,
  WarningOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";

import { getUsers, deleteUser } from "../../api/userApi";

import MyCard from "../../components/MyCard";
import { useNotify } from "../../components/NotificationProvider";
import formatDate from "../../utils/format-date";
import UserForm from "./UserForm";

const UserPage = () => {
  const { notify, contextHolder } = useNotify();

  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    keyword: "",
    role: undefined,
    status: undefined,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
  });

  const ROLE_LABEL = {
    ADMIN: "Quản trị viên",
    STAFF: "Nhân viên",
    // USER: "Người dùng", // nếu có thêm
  };

  const STATUS_LABEL = {
    ACTIVE: "Hoạt động",
    INACTIVE: "Ngưng hoạt động",
  };

  const columns = [
    {
      title: "Tên người dùng",
      dataIndex: "fullName",
      key: "fullName",
      width: "20%",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "20%",
      render: (email) => (
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <MailOutlined style={{ color: "#1890ff" }} />
          {email}
        </span>
      ),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: "15%",
      render: (phone) => (
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <PhoneOutlined style={{ color: "#52c41a" }} />
          {phone}
        </span>
      ),
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      width: "12%",
      render: (role) => (
        <Tag color={role === "ADMIN" ? "red" : "blue"}>
          {ROLE_LABEL[role] || role}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "12%",
      render: (status) => (
        <Tag color={status === "ACTIVE" ? "green" : "default"}>
          {STATUS_LABEL[status] || status}
        </Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: "15%",
      render: (date) => formatDate(date),
    },
    {
      title: "Thao tác",
      key: "action",
      width: "16%",
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
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <WarningOutlined style={{ color: "red", fontSize: 17 }} />
                  <Typography.Text strong>Xóa người dùng</Typography.Text>
                </div>
                <Typography.Text type="secondary">
                  Bạn có chắc chắn muốn xóa người dùng này?
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

  /* ================= API ================= */

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      notify({ type: "success", message: "Xóa người dùng thành công!" });
      fetchUsers();
    } catch {
      notify({ type: "error", message: "Xóa người dùng thất bại!" });
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsers({
        keyword: filters.keyword,
        role: filters.role,
        status: filters.status,
        page: pagination.page,
        size: pagination.size,
      });
      setUsers(res);
      console.log(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filters, pagination.page, pagination.size]);

  /* ================= PAGINATION ================= */

  const onPageChange = (page) => setPagination((prev) => ({ ...prev, page }));

  const onSizeChange = (_, size) => setPagination({ page: 1, size });

  /* ================= MODAL ================= */

  const [modal, setModal] = useState({
    isOpen: false,
    mode: "",
    record: null,
  });
  const showModal = (mode, record = null) =>
    setModal({ isOpen: true, mode, record });
  const hideModal = () => setModal({ ...modal, isOpen: false });
  /* ================= UI ================= */

  return (
    <Fragment>
      {contextHolder}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div>
          <h1 style={{ marginBottom: 5, fontWeight: 700, color: "#536ee7ff" }}>
            Quản lý người dùng
          </h1>
          <h4 style={{ color: "#536ee7ff" }}>
            Danh sách người dùng trong hệ thống
          </h4>
        </div>

        <Button type="primary" onClick={() => showModal("add")}>
          <PlusOutlined />
          Thêm người dùng
        </Button>
      </div>

      <Flex vertical gap={25}>
        <MyCard title="Tìm kiếm và lọc">
          <Row gutter={12}>
            <Col span={14}>
              <Input
                placeholder="Tìm theo tên, email hoặc số điện thoại"
                prefix={<SearchOutlined style={{ color: "#aaa" }} />}
                allowClear
                value={filters.keyword}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    keyword: e.target.value,
                  }))
                }
              />
            </Col>

            {/* Role - 3 phần */}
            <Col span={5}>
              <Select
                allowClear
                placeholder="Vai trò"
                style={{ width: "100%" }}
                value={filters.role}
                onChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    role: value,
                  }))
                }
                options={[
                  { value: "ADMIN", label: "Admin" },
                  { value: "STAFF", label: "Nhân viên" },
                ]}
              />
            </Col>

            <Col span={5}>
              <Select
                allowClear
                placeholder="Trạng thái"
                style={{ width: "100%" }}
                value={filters.status}
                onChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    status: value,
                  }))
                }
                options={[
                  { value: "ACTIVE", label: "Hoạt động" },
                  { value: "INACTIVE", label: "Ngưng hoạt động" },
                ]}
              />
            </Col>
          </Row>
        </MyCard>

        <MyCard title="Danh sách người dùng">
          <Table
            size="small"
            columns={columns}
            dataSource={users.items}
            rowKey="id"
            loading={loading}
            pagination={false}
          />

          <Pagination
            current={pagination.page}
            pageSize={pagination.size}
            total={users.totalElements}
            showSizeChanger
            pageSizeOptions={["5", "10", "20", "50"]}
            onChange={onPageChange}
            onShowSizeChange={onSizeChange}
            style={{
              marginTop: 16,
              display: "flex",
              justifyContent: "flex-end",
            }}
          />
        </MyCard>
      </Flex>

      {modal.isOpen && (
        <UserForm
          isMode={modal.mode}
          record={modal.record || {}}
          isModal={modal.isOpen}
          hideModal={hideModal}
          fetchUsers={fetchUsers}
          notify={notify}
          setLoading={setLoading}
        />
      )}
    </Fragment>
  );
};

export default UserPage;
