import React, { Fragment, useEffect, useState } from "react";
import { FiMapPin } from "react-icons/fi";

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
  ExclamationCircleOutlined,
  WarningOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { deleteBuilding, getBuildings } from "../../api/buildingApi";
import MyCard from "../../components/MyCard";
import { useNotify } from "../../components/NotificationProvider";
import BuildingForm from "./BuildingFrom";
import { render } from "@testing-library/react";
import formatDate from "../../utils/format-date";

const BuildingPage = () => {
  const { notify, contextHolder } = useNotify();
  const [buildings, setBuildings] = useState({});
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
  });
  const columns = [
    { title: "Tên", dataIndex: "name", key: "name", width: "15%" },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      width: "20%",
      render: (text) => (
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <FiMapPin size={13} />
          {text}
        </span>
      ),
    },
    {
      title: "Số tầng",
      dataIndex: "numberOfFloors",
      key: "numberOfFloors",
      width: "8%",
    },
    {
      title: "Diện tích",
      dataIndex: "area",
      key: "area",
      width: "8%",
      render: (area) => `${area} m²`,
    },
    {
      title: "Tổng phòng",
      dataIndex: "totalRooms",
      key: "totalRooms",
      width: "8%",
    },
    {
      title: "Tiện ích",
      dataIndex: "amenityNames",
      key: "amenityNames",
      width: "20%",
      render: (amenities) => {
        const visible = amenities.slice(0, 2);
        const extra = amenities.length - visible.length;
        return (
          <>
            {visible.map((amenity) => (
              <Tag color="blue" key={amenity}>
                {amenity}
              </Tag>
            ))}
            {extra > 0 && <Tag>+{extra}</Tag>}
          </>
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: "10%",
      render: (date) => formatDate(date),
    },
    {
      title: "Thao tác",
      key: "action",
      width: "11%",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Chỉnh sửa">
            <Button
              icon={<FormOutlined />}
              onClick={() => showModal("edit", record)}
            />
          </Tooltip>

          <Popconfirm
            icon={null} // ẩn icon mặc định
            title={
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <WarningOutlined style={{ color: "red", fontSize: 17 }} />
                  <Typography.Text strong>Xóa tòa nhà</Typography.Text>
                </div>
                <Typography.Text type="secondary" style={{ fontSize: 14 }}>
                  Bạn có chắc chắn muốn xóa tòa nhà này? Tất cả dữ liệu liên
                  quan sẽ mất và không thể khôi phục!
                </Typography.Text>
              </div>
            }
            okText="Xóa"
            okButtonProps={{ danger: true }}
            cancelText="Hủy"
            onConfirm={() => handleDelete(record.id)}
            placement="topRight"
            overlayStyle={{ maxWidth: 300 }} // giới hạn chiều rộng
          >
            <Tooltip title="Xóa">
              <Button icon={<DeleteOutlined />} danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  const handleDelete = async (id) => {
    try {
      await deleteBuilding(id); // giả sử bạn có hàm này
      notify({
        type: "success",
        message: "Xóa tòa nhà thành công!",
      });
      fetchBuilding(); // load lại danh sách
    } catch (error) {
      notify({
        type: "error",
        message: "Xóa tòa nhà thất bại!",
      });
    }
  };

  const fetchBuilding = async () => {
    setLoading(true);
    try {
      const res = await getBuildings({
        keyword,
        page: pagination.page,
        size: pagination.size,
      });
      setBuildings(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuilding();
  }, [keyword, pagination.page, pagination.size]);

  const onPageChange = (newPage) =>
    setPagination((prev) => ({ ...prev, page: newPage }));
  const onsizeChange = (current, size) =>
    setPagination({ page: 1, size: size });

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
            Quản lý tòa nhà
          </h1>
          <h4 style={{ color: "#536ee7ff" }}>
            Danh sách tất cả các tòa nhà trong hệ thống
          </h4>
        </div>
        <Button type="primary" onClick={() => showModal("add")}>
          <PlusOutlined />
          Thêm tòa nhà
        </Button>
      </div>
      <Flex vertical gap={25}>
        <MyCard title="Tìm kiếm và lọc">
          <Input
            placeholder="Tìm kiếm theo tên tòa nhà, địa chỉ, mô tả..."
            prefix={
              <SearchOutlined style={{ color: "#aaa", marginRight: 4 }} />
            }
            allowClear
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
            }}
          />
        </MyCard>

        <MyCard title="Danh sách tòa nhà">
          <Table
            size="small"
            columns={columns}
            dataSource={buildings.items}
            rowKey="id"
            loading={loading}
            pagination={false}
          />
          <Pagination
            current={pagination.page}
            pageSize={pagination.size}
            total={buildings.totalItems}
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

      {open.isModal && (
        <BuildingForm
          isMode={open.isMode}
          record={open.record || {}}
          hideModal={hideModal}
          isModal={open.isModal}
          fetchBuilding={fetchBuilding}
          notify={notify}
          setLoading={setLoading}
        />
      )}
    </Fragment>
  );
};
export default BuildingPage;
