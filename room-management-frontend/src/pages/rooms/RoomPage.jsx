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
  Image,
  message,
  Popconfirm,
  Typography,
  Tooltip,
} from "antd";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  PlusOutlined,
  FormOutlined,
  DeleteOutlined,
  SearchOutlined,
  EyeOutlined,
  CopyOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { deleteRoom, getRoomDashboard, getRooms } from "../../api/roomApi";
import { getBuildingAll, getBuildings } from "../../api/buildingApi";
import MyCard from "../../components/MyCard";
import { useNotify } from "../../components/NotificationProvider";
import RoomFrom from "./RoomForm";
import { ROOM_STATUS_OPTIONS, ROOM_TYPE_OPTIONS } from "../../constants/labels";
import { formatCurrency } from "../../utils/format-currency";

const { Option } = Select;

const RoomPage = () => {
  const { notify, contextHolder } = useNotify();
  const [filters, setFilters] = useState({
    keyword: "",
    roomType: undefined,
    status: undefined,
    buildingId: undefined,
  });

  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
  });

  const [rooms, setRooms] = useState({});

  const [loading, setLoading] = useState(false);

  const [modal, setModal] = useState({
    isOpen: false,
    mode: "",
    record: null,
  });

  const [buildings, setBuildings] = useState([]);

  const fetchBuildings = async () => {
    try {
      const data = await getBuildingAll();
      setBuildings(data);
      console.log(data);
    } catch (error) {
      console.error("Lấy danh sách tòa nhà thất bại:", error);
    }
  };

  useEffect(() => {
    fetchBuildings();
  }, []);

  // === FETCH ROOMS ===
  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await getRooms({
        keyword: filters.keyword,
        roomType: filters.roomType,
        status: filters.status,
        buildingId: filters.buildingId,
        page: pagination.page,
        size: pagination.size,
      });
      setRooms(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
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
      await deleteRoom(id);
      notify({
        type: "success",
        message: "Xóa phòng thành công!",
      });
      fetchRooms();
      loadDashboard();
    } catch (error) {
      notify({
        type: "error",
        message: "Xóa phòng thất bại!",
        description:
          error?.response?.data?.message || "Xảy ra lỗi khi xóa phòng!",
      });
    }
  };

  // === TABLE COLUMNS ===
  const columns = [
    { title: "Tên phòng", dataIndex: "name", key: "name" },
    { title: "Tòa nhà", dataIndex: "buildingName", key: "buildingName" },
    {
      title: "Loại phòng",
      dataIndex: "roomType",
      key: "roomType",
      render: (value) => {
        const option = ROOM_TYPE_OPTIONS.find((opt) => opt.value === value);
        return option ? option.label : value;
      },
    },
    { title: "Tầng", dataIndex: "floor", key: "floor" },
    {
      title: "Diện tích",
      dataIndex: "area",
      key: "area",
      render: (value) => `${value} m²`,
    },
    {
      title: "Giá thuê",
      dataIndex: "rentalPrice",
      key: "rentalPrice",
      render: (value) => formatCurrency(value, true),
    },
    { title: "Sức chứa", dataIndex: "maxOccupancy", key: "maxOccupancy" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (value) => {
        const option = ROOM_STATUS_OPTIONS.find((opt) => opt.value === value);
        const label = option ? option.label : value;
        const color = STATUS_COLOR_MAP[value] || "default";

        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: "Ảnh phòng",
      dataIndex: "images",
      key: "images",
      render: (images) => {
        if (!images || images.length === 0) {
          return (
            <span style={{ color: "#999", fontStyle: "italic" }}>
              Không có ảnh
            </span>
          );
        }

        const firstImage = images[0]?.imageUrl;
        const extra = images.length - 1;

        return (
          <Image.PreviewGroup>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Image
                src={firstImage}
                alt="phòng"
                width={50}
                height={50}
                style={{ objectFit: "cover", borderRadius: 4 }}
                preview={{
                  mask: <EyeOutlined style={{ fontSize: 20, color: "#fff" }} />,
                }}
              />
              {extra > 0 && <span style={{ fontWeight: 500 }}>+{extra}</span>}
              {images.slice(1).map((img) => (
                <Image
                  key={img.id}
                  src={img.imageUrl}
                  style={{ display: "none" }}
                  preview={{
                    mask: (
                      <EyeOutlined style={{ fontSize: 20, color: "#fff" }} />
                    ),
                  }}
                />
              ))}
            </div>
          </Image.PreviewGroup>
        );
      },
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Copy link">
            <Button
              icon={<CopyOutlined />}
              onClick={() => handleCopyLink(record.name)}
            ></Button>
          </Tooltip>

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
                  <Typography.Text strong>Xóa phòng</Typography.Text>
                </div>
                <Typography.Text type="secondary" style={{ fontSize: 14 }}>
                  Bạn có chắc chắn muốn xóa phòng này? Tất cả dữ liệu liên quan
                  sẽ mất và không thể khôi phục!
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
  const STATUS_COLOR_MAP = {
    AVAILABLE: "green",
    OCCUPIED: "red",
    MAINTENANCE: "orange",
    RESERVED: "blue",
    CLOSED: "gray",
  };
  const handleCopyLink = (roomCode) => {
    const url = `${window.location.origin}/xem-phong?phong=${roomCode}`;
    navigator.clipboard
      .writeText(url)
      .then(() =>
        notify({ type: "success", message: "Đã sao chép link phòng!" }),
      )
      .catch(() => notify({ type: "error", message: "Sao chép thất bại!" }));
  };
  const [dashboard, setDashboard] = useState({});
  const loadDashboard = async () => {
    try {
      const res = await getRoomDashboard();
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
            Quản lý phòng trọ
          </h1>
          <h4 style={{ color: "#536ee7ff" }}>
            Danh sách tất cả các phòng trọ trong hệ thống
          </h4>
        </div>
        <Button type="primary" onClick={() => showModal("add")}>
          <PlusOutlined /> Thêm phòng
        </Button>
      </div>

      <Flex vertical gap={25}>
        {/* Filter */}
        <MyCard title="Tìm kiếm và lọc">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Input
              placeholder="Tìm kiếm theo tên phòng, mô tả..."
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
                placeholder="Loại phòng"
                value={filters.roomType}
                onChange={(val) =>
                  setFilters((prev) => ({ ...prev, roomType: val }))
                }
                allowClear
                style={{ flex: 1 }}
              >
                {ROOM_TYPE_OPTIONS.map((status) => (
                  <Option key={status.value} value={status.value}>
                    {status.label}
                  </Option>
                ))}
              </Select>

              <Select
                placeholder="Trạng thái"
                value={filters.status}
                onChange={(val) =>
                  setFilters((prev) => ({ ...prev, status: val }))
                }
                allowClear
                style={{ flex: 1 }}
              >
                {ROOM_STATUS_OPTIONS.map((status) => (
                  <Option key={status.value} value={status.value}>
                    {status.label}
                  </Option>
                ))}
              </Select>

              <Select
                placeholder="Tòa nhà"
                value={filters.buildingId}
                onChange={(val) =>
                  setFilters((prev) => ({ ...prev, buildingId: val }))
                }
                allowClear
                style={{ flex: 1 }}
              >
                {buildings.map((b) => (
                  <Option key={b.id} value={b.id}>
                    {b.name}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
        </MyCard>

        {/* Statistics */}
        <Row gutter={[24, 24]}>
          {/* Tổng số phòng */}
          <Col xs={24} sm={12} md={6}>
            <Card
              style={{
                borderTop: "4px solid #1890ff",
                borderRadius: 8,
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
              }}
            >
              <Statistic
                title="Tổng số phòng"
                value={dashboard.totalRooms}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>

          {/* Phòng đang sử dụng */}
          <Col xs={24} sm={12} md={6}>
            <Card
              style={{
                borderTop: "4px solid #52c41a",
                borderRadius: 8,
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
              }}
            >
              <Statistic
                title="Phòng đang sử dụng"
                value={dashboard.occupiedRooms}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>

          {/* Phòng đang bảo trì */}
          <Col xs={24} sm={12} md={6}>
            <Card
              style={{
                borderTop: "4px solid #faad14",
                borderRadius: 8,
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
              }}
            >
              <Statistic
                title="Phòng đang bảo trì"
                value={dashboard.maintenanceRooms}
                valueStyle={{ color: "#faad14" }}
              />
            </Card>
          </Col>

          {/* Phòng trống */}
          <Col xs={24} sm={12} md={6}>
            <Card
              style={{
                borderTop: "4px solid #ff4d4f",
                borderRadius: 8,
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
              }}
            >
              <Statistic
                title="Phòng trống"
                value={dashboard.availableRooms}
                valueStyle={{ color: "#ff4d4f" }}
              />
            </Card>
          </Col>
        </Row>

        {/* Table */}
        <MyCard title="Danh sách phòng trọ">
          <Table
            size="large"
            columns={columns}
            dataSource={rooms.items}
            rowKey="id"
            loading={loading}
            pagination={false}
          />
          <Pagination
            current={pagination.page}
            pageSize={pagination.size}
            total={rooms.totalItems}
            showSizeChanger
            pageSizeOptionss={["5", "10", "20", "50"]}
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

      {/* Room Modal */}
      {modal.isOpen && (
        <RoomFrom
          isMode={modal.mode}
          record={modal.record || {}}
          hideModal={hideModal}
          isModal={modal.isOpen}
          fetchRooms={fetchRooms}
          notify={notify}
          loadDashboard={loadDashboard}
          buildings={buildings}
        />
      )}
    </Fragment>
  );
};

export default RoomPage;
