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
  DatePicker,
  Tooltip,
  Popconfirm,
} from "antd";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  PlusOutlined,
  FormOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";

import { getpayments } from "../../api/contractApi";
import MyCard from "../../components/MyCard";
import { useNotify } from "../../components/NotificationProvider";
import {
  CONTRACT_STATUS_OPTIONS,
  PAYMENT_CYCLE_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
} from "../../constants/labels";
import { formatCurrency } from "../../utils/format-currency";

import { getPayments } from "../../api/paymentApi";
import PaymentForm from "./PaymentForm";
import FormatDate from "../../utils/format-date";
const { Option } = Select;
const { RangePicker } = DatePicker;
const PaymentPage = () => {
  const { notify, contextHolder } = useNotify();
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    keyword: "",
    paymentMethod: undefined,
    payDateFrom: undefined,
    payDateTo: undefined,
  });

  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
  });

  const [payments, setPayments] = useState({});

  const [modal, setModal] = useState({
    isOpen: false,
    mode: "",
    record: null,
  });

  const fetchPayments = async () => {
    setLoading(true);
    const payDateFrom = filters.dueDateRange?.[0]
      ? filters.payDateRange[0].format("YYYY-MM-DD")
      : undefined;
    const payDateTo = filters.dueDateRange?.[1]
      ? filters.payDateRange[1].format("YYYY-MM-DD")
      : undefined;
    try {
      const res = await getPayments({
        keyword: filters.keyword,
        paymentMethod: filters.paymentMethod,
        payDateFrom,
        payDateTo,
        page: pagination.page,
        size: pagination.size,
      });
      setPayments(res);
      setPagination({ page: res.currentPage, size: res.pageSize });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
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

  const PAYMENT_METHOD_MAP = PAYMENT_METHOD_OPTIONS.reduce((acc, cur) => {
    acc[cur.value] = cur.label;
    return acc;
  }, {});

  // === TABLE COLUMNS ===
  const columns = [
    // { title: "Mã thanh toán", dataIndex: "paymentCode", key: "paymentCode", width: 140 }
    {
      title: "Mã hóa đơn",
      dataIndex: "invoiceCode",
      key: "invoiceCode",
      render: (v, r) => v || r.invoice?.invoiceCode,
    },
    {
      title: "Số tiền",
      dataIndex: "paymentAmount",
      key: "paymentAmount",
      render: (v) => (v != null ? `${Number(v).toLocaleString()} đ` : "-"),
    },
    {
      title: "Phương thức",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (value) => PAYMENT_METHOD_MAP[value] || value,
    },
    {
      title: "Ngày thanh toán",
      dataIndex: "paymentDate",
      key: "FormatDate",
      render: (v) => FormatDate(v),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      ellipsis: { showTitle: false },
      render: (value) =>
        value && value.trim() !== "" ? (
          <Tooltip title={value}>{value}</Tooltip>
        ) : (
          <span style={{ color: "#ccc" }}>—</span>
        ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 140,
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button icon={<EyeOutlined />} />
          </Tooltip>
          <Tooltip title="Cập nhật">
            <Button
              // type="text"
              icon={<FormOutlined />}
              onClick={() => showModal("edit", record)}
            />
          </Tooltip>

          <Popconfirm
            title="Bạn có chắc muốn xóa thanh toán này?"
            // onConfirm={async () => {
            //   // try {
            //   //   await onDelete(record.id);
            //   //   message.success("Xóa thành công");
            //   //   // reload current page
            //   //   load(pagination.page, pagination.size, filters);
            //   // } catch (err) {
            //   //   console.error(err);
            //   //   message.error("Xóa thất bại");
            //   // }
            // }}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Tooltip title="Xóa">
              <Button danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];
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
            Quản lý lịch sử thanh toán
          </h1>
          <h4 style={{ color: "#536ee7ff" }}>
            Danh sách tất cả các thanh toán trong hệ thống
          </h4>
        </div>
        <Button type="primary" onClick={() => showModal("add")}>
          <PlusOutlined /> Thêm thanh toán
        </Button>
      </div>
      <Flex vertical gap={25}>
        {/* Filter */}

        <MyCard title="Tìm kiếm và lọc">
          <Row gutter={20}>
            <Col span={12}>
              <Input
                placeholder="Tìm kiếm theo mã hóa đơn,ghi chú,..."
                allowClear
                value={filters.keyword}
                onChange={(e) => {
                  setFilters((prev) => ({ ...prev, keyword: e.target.value }));
                }}
              />
            </Col>
            <Col span={5}>
              <Select
                placeholder="Phương thức"
                value={filters.paymentMethod}
                onChange={(val) =>
                  setFilters((prev) => ({ ...prev, paymentMethod: val }))
                }
                allowClear
                style={{ width: "100%" }}
                options={PAYMENT_METHOD_OPTIONS}
              ></Select>
            </Col>
            <Col span={7}>
              <RangePicker
                placeholder={["Hạn từ", "Hạn đến"]}
                value={filters.payDateRange}
                onChange={(dates) =>
                  setFilters((prev) => ({ ...prev, payDateRange: dates }))
                }
                style={{ width: "100%" }}
              />
            </Col>
          </Row>
        </MyCard>

        {/* Statistics */}
        <Row gutter={{ xs: 16, sm: 24, md: 30 }}>
          <Col xs={24} sm={12} md={8}>
            <Card variant="borderless">
              <Statistic
                title={
                  <span>
                    Tổng số phòng
                    <ArrowUpOutlined
                      style={{ marginLeft: 5, color: "#3f8600" }}
                    />
                  </span>
                }
                value={11}
                valueStyle={{ color: "#3f8600" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card variant="borderless">
              <Statistic
                title={
                  <span>
                    <ArrowDownOutlined /> Phòng trống
                  </span>
                }
                value={9}
                valueStyle={{ color: "#cf1322" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card variant="borderless">
              <Statistic
                title={
                  <span>
                    Đang thuê
                    <ArrowUpOutlined
                      style={{ marginLeft: 5, color: "#3f8600" }}
                    />
                  </span>
                }
                value={7}
                valueStyle={{ color: "#3f8600" }}
              />
            </Card>
          </Col>
        </Row>

        {/* Table */}
        <MyCard title="Danh sách lịch sử thanh toán">
          <Table
            size="small"
            columns={columns}
            dataSource={payments.items}
            rowKey="id"
            loading={loading}
            pagination={false}
          />
          <Pagination
            current={pagination.page}
            pageSize={pagination.size}
            total={payments.totalItems}
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
        <PaymentForm
          isMode={modal.mode}
          record={modal.record}
          hideModal={hideModal}
          isModal={modal.isOpen}
          fetchPayments={fetchPayments}
          notify={notify}
        />
      )}
    </Fragment>
  );
};

export default PaymentPage;
