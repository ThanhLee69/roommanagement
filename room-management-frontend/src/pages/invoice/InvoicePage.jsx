import React, { useEffect, useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
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
  Modal,
} from "antd";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  PlusOutlined,
  FormOutlined,
  DeleteOutlined,
  EyeOutlined,
  CreditCardOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

import { getinvoices } from "../../api/contractApi";
import MyCard from "../../components/MyCard";
import { useNotify } from "../../components/NotificationProvider";
// import ContractFrom from "./ContractFrom";
import {
  CONTRACT_STATUS_OPTIONS,
  INVOICE_STATUS_OPTIONS,
  PAYMENT_CYCLE_OPTIONS,
} from "../../constants/labels";
import { formatCurrency } from "../../utils/format-currency";
import { getRooms } from "../../api/roomApi";
import BuildingSelect from "../../components/BuildingSelect";
import RoomSelect from "../../components/RoomSelect";
import { path_name } from "../../constants/path_name";
import { getInvoiceDashboard, getInvoices } from "../../api/invoiceApi";
import { format } from "prettier";
import FormatDate from "../../utils/format-date";
import InvoiceDetailModal from "./InvoicePreview";
import InvoicePreview from "./InvoicePreview";
import PayInvoiceModal from "./InvoicePaymentModal";

const { Option } = Select;
const { RangePicker } = DatePicker;
const InvoicePage = () => {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const { notify, contextHolder } = useNotify();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    keyword: "",
    month: undefined,
    year: undefined,
    status: undefined,
    dueDateFrom: undefined,
    dueDateTo: undefined,
  });

  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
  });

  const [invoices, setInvoices] = useState({});

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const dueDateFrom = filters.dueDateRange?.[0]
        ? filters.dueDateRange[0].format("YYYY-MM-DD")
        : undefined;
      const dueDateTo = filters.dueDateRange?.[1]
        ? filters.dueDateRange[1].format("YYYY-MM-DD")
        : undefined;
      const res = await getInvoices({
        keyword: filters.keyword,
        invoiceStatus: filters.invoiceStatus,
        month: filters.month,
        year: filters.year,
        dueDateFrom,
        dueDateTo,
        page: pagination.page,
        size: pagination.size,
      });
      setInvoices(res);
      console.log(res);
      setPagination({ page: res.currentPage, size: res.pageSize });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [filters, pagination.page, pagination.size]);

  // === PAGINATION HANDLER ===
  const onPageChange = (newPage) =>
    setPagination((prev) => ({ ...prev, page: newPage }));
  const onsizeChange = (current, size) =>
    setPagination({ page: 1, size: size });

  // === TABLE COLUMNS ===
  const columns = [
    {
      title: "Mã hóa đơn",
      dataIndex: "invoiceCode",
      key: "invoiceCode",
      width: "10%",
    },
    { title: "Phòng", dataIndex: "roomName", key: "roomName", with: "8%" },
    {
      title: "Người thuê",
      dataIndex: "tenantName",
      key: "tenantName",
      with: "13%",
    },
    {
      title: "Tháng/Năm",
      key: "monthYear",
      width: "7%",
      render: (_, record) =>
        `${record.month.toString().padStart(2, "0")}/${record.year}`,
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: "8%",
      render: (_, record) => formatCurrency(record.totalAmount, true),
    },
    {
      title: "Đã thanh toán",
      dataIndex: "paidAmount",
      key: "paidAmount",
      width: "10%",
      render: (_, record) => (
        <div style={{ color: "#52c41a" }}>
          {formatCurrency(record.paidAmount, true)}
        </div>
      ),
    },

    {
      title: "Còn lại",
      dataIndex: "remainingAmount",
      key: "remainingAmount",
      width: "8%",
      render: (_, record) => (
        <div style={{ color: record.remainingAmount > 0 ? "red" : "#52c41a" }}>
          {formatCurrency(record.remainingAmount, true)}
        </div>
      ),
    },
    {
      title: "Hạn thanh toán",
      dataIndex: "dueDate",
      key: "dueDate",
      width: "10%",
      render: (_, record) => FormatDate(record.dueDate),
    },
    {
      title: "Trạng thái",
      dataIndex: "invoiceStatus",
      key: "invoiceStatus",
      width: "10%",
      render: (_, record) => {
        const status = INVOICE_STATUS_OPTIONS.find(
          (item) => item.value === record.invoiceStatus,
        );

        let color = "default";
        switch (record.invoiceStatus) {
          case "UNPAID":
            color = "red";
            break;
          case "PARTIALLY_PAID":
            color = "orange";
            break;
          case "PAID":
            color = "green";
            break;
          case "OVERDUE":
            color = "volcano";
            break;
          case "CANCELLED":
            color = "gray";
            break;
          default:
            color = "default";
        }

        return <Tag color={color}>{status?.label || record.invoiceStatus}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: "14%",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EyeOutlined />}
            title="Xem chi tiết"
            style={{ color: "#1890ff", fontSize: 18 }}
            onClick={() => {
              setSelectedInvoice(record);
              setOpen(true);
            }}
          />

          {record.invoiceStatus !== "PAID" && (
            <Button
              type="text"
              icon={<FormOutlined />}
              title="Chỉnh sửa"
              style={{ color: "#faad14" }}
              onClick={() => navigate(`${path_name.invoice}/${record.id}`)}
            />
          )}

          {/* Thanh toán - Ẩn nếu hóa đơn đã thanh toán */}
          {record.invoiceStatus !== "PAID" && record.remainingAmount > 0 && (
            <Button
              icon={<CreditCardOutlined />}
              type="text"
              style={{ color: "#1890ff" }}
              title="Thanh toán"
              onClick={() => openPayment(record)}
            />
          )}
          <Button icon={<DownloadOutlined />} type="text" title="Tải xuống" />
          <Button type="text" icon={<DeleteOutlined />} danger title="Xóa" />
        </Space>
      ),
    },
  ];
  const [dashboard, setDashboard] = useState({});
  useEffect(() => {
    async function load() {
      const res = await getInvoiceDashboard();
      setDashboard(res.result);
    }
    load();
  }, []);
  const [open, setOpen] = useState(false);
  const [openPay, setOpenPay] = useState(false);
  const openPayment = (invoice) => {
    setSelectedInvoice(invoice);
    setOpenPay(true);
  };
  return (
    <Fragment>
      {contextHolder}
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        centered
        width={600}
      >
        <InvoicePreview invoice={selectedInvoice} />
      </Modal>
      <PayInvoiceModal
        open={openPay}
        onClose={() => setOpenPay(false)}
        invoice={selectedInvoice}
        reload={fetchInvoices}
        notify={notify}
      />
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
            Quản lý hóa đơn
          </h1>
          <h4 style={{ color: "#536ee7ff" }}>
            Danh sách tất cả các hóa đơn trong hệ thống
          </h4>
        </div>
        <Button
          type="primary"
          onClick={() => navigate(path_name.invoice + "/them-moi")}
        >
          <PlusOutlined /> Tạo hóa đơn
        </Button>
      </div>
      <Flex vertical gap={25}>
        {/* Filter */}

        <MyCard title="Tìm kiếm & lọc hóa đơn">
          <Col>
            <Input
              placeholder="Tìm kiếm theo mã hóa đơn, tên khách thuê, phòng..."
              allowClear
              value={filters.keyword}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, keyword: e.target.value }))
              }
              style={{ width: "100%" }}
            />
          </Col>
          <Row gutter={25} style={{ marginTop: 15 }}>
            <Col span={5}>
              <Select
                placeholder="Tháng"
                value={filters.month}
                onChange={(val) =>
                  setFilters((prev) => ({ ...prev, month: val }))
                }
                allowClear
                style={{ width: "100%" }}
                options={Array.from({ length: 12 }, (_, i) => ({
                  value: i + 1,
                  label: `${i + 1}`,
                }))}
              />
            </Col>
            <Col span={5}>
              <Select
                placeholder="Năm"
                value={filters.year}
                onChange={(val) =>
                  setFilters((prev) => ({ ...prev, year: val }))
                }
                allowClear
                style={{ width: "100%" }}
                options={Array.from({ length: 5 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return { value: year, label: `${year}` };
                })}
              />
            </Col>
            <Col span={6}>
              <Select
                placeholder="Trạng thái"
                value={filters.invoiceStatus}
                onChange={(val) =>
                  setFilters((prev) => ({ ...prev, invoiceStatus: val }))
                }
                allowClear
                style={{ width: "100%" }}
                options={INVOICE_STATUS_OPTIONS}
              />
            </Col>
            <Col span={8}>
              <RangePicker
                placeholder={["Hạn từ", "Hạn đến"]}
                value={filters.dueDateRange}
                onChange={(dates) =>
                  setFilters((prev) => ({ ...prev, dueDateRange: dates }))
                }
                style={{ width: "100%" }}
              />
            </Col>
          </Row>
        </MyCard>

        {/* Statistics */}
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} md={6}>
            <Card
              variant="borderless"
              style={{
                borderTop: "4px solid #52c41a",
                borderRight: "4px solid #52c41a",
                borderRadius: 8,
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
              }}
            >
              <Statistic
                title="Tổng số hóa đơn"
                value={dashboard.totalInvoice}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card
              variant="borderless"
              style={{
                borderTop: "4px solid #1890ff",
                borderRight: "4px solid #1890ff",
                borderRadius: 8,
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
              }}
            >
              <Statistic
                title="Hóa đơn chưa thanh toán"
                value={dashboard.unpaidInvoice}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card
              variant="borderless"
              style={{
                borderTop: "4px solid #ff4d4f",
                borderRight: "4px solid #ff4d4f",
                borderRadius: 8,
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
              }}
            >
              <Statistic
                title="Hóa đơn quá hạn"
                value={dashboard.overdueInvoice}
                valueStyle={{ color: "#ff4d4f" }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card
              variant="borderless"
              style={{
                borderTop: "4px solid #faad14",
                borderRight: "4px solid #faad14",
                borderRadius: 8,
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
              }}
            >
              <Statistic
                title="Tổng tiền cần thu"
                value={formatCurrency(dashboard.outstandingAmount, true)}
                valueStyle={{ color: "#faad14" }}
              />
            </Card>
          </Col>
        </Row>

        {/* Table */}
        <MyCard title="Danh sách hóa đơn">
          <Table
            size="small"
            columns={columns}
            dataSource={invoices.items}
            rowKey="id"
            loading={loading}
            pagination={false}
          />
          <Pagination
            current={pagination.currentPage}
            pageSize={pagination.size}
            total={invoices.totalItems}
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
    </Fragment>
  );
};

export default InvoicePage;
