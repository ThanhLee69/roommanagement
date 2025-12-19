import React, { useState, Label, useEffect } from "react";
import {
  Segmented,
  Button,
  Form,
  Input,
  Row,
  Col,
  InputNumber,
  Select,
  DatePicker,
  Card,
  Statistic,
  Table,
  Empty,
  Spin,
} from "antd";
import {
  InfoCircleOutlined,
  FileImageOutlined,
  RollbackOutlined,
  ThunderboltOutlined,
  DropboxOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  DeleteOutlined,
  FormOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import MyCard from "../../components/MyCard";
import { useNavigate, useParams } from "react-router-dom";
import { path_name } from "../../constants/path_name";
import { getServiceAll } from "../../api/serviceApi";
import { useNotify } from "../../components/NotificationProvider";
import { getByRoomAndMonthYear } from "../../api/meterApi";
import { getActiveContracts } from "../../api/contractApi";
import dayjs from "dayjs";
import { formatCurrency } from "../../utils/format-currency";
import {
  createInvoice,
  getInvoiceById,
  updateInvoice,
} from "../../api/invoiceApi";

const InvoiceForm = () => {
  const { invoiceId } = useParams();
  useEffect(() => {
    if (invoiceId) {
      // nếu có invoiceId, đang chỉnh sửa -> load dữ liệu
      const fetchInvoice = async () => {
        try {
          setLoading(true);
          const data = await getInvoiceById(invoiceId);
          console.log(data);
          // map data vào formData
          setFormData({
            invoiceCode: data.invoiceCode,
            contractId: data.contractId,
            contractCode: data.contractCode,
            roomName: data.roomName,
            tenantName: data.tenantName,
            year: data.year,
            month: data.month,
            electricStart: data.electricStart,
            electricEnd: data.electricEnd,
            electricPrice: data.electricPrice,
            waterStart: data.waterStart,
            waterEnd: data.waterEnd,
            waterPrice: data.waterPrice,
            rentAmount: data.rentAmount,
            extraFee: data.extraFee,
            dueDate: data.dueDate ? dayjs(data.dueDate) : null,
            note: data.note,
          });

          setSelectedServices(
            data.invoiceItems.map((item) => ({
              serviceId: item.serviceId,
              name: item.serviceName,
              price: item.price,
              quantity: item.quantity,
            })),
          );
        } catch (error) {
          notify({ type: "error", message: "Lấy thông tin hóa đơn thất bại!" });
        } finally {
          setLoading(false);
        }
      };

      fetchInvoice();
    }
  }, [invoiceId]);
  // STATE QUẢN LÝ TAB & DỊCH VỤ
  const [loading, setLoading] = useState(false);

  const [tab, setTab] = useState("info");
  const [selectedServices, setSelectedServices] = useState([]);

  // HOOK & TIỆN ÍCH
  const navigate = useNavigate();
  const { notify, contextHolder } = useNotify();
  const now = dayjs();

  // TẠO MÃ HÓA ĐƠN
  const dateStr = now.format("DDMMYYYY");
  const random = Math.floor(1000 + Math.random() * 9000);
  const invoiceCode = `HD-${dateStr}-${random}`;

  // FORM DATA HÓA ĐƠN
  const [formData, setFormData] = useState({
    invoiceCode,
    contractId: null,
    contractCode: "",
    roomName: "",
    tenantName: "",

    // KỲ HÓA ĐƠN
    year: now.year(),
    month: now.month() + 1,

    // CHỈ SỐ ĐIỆN
    electricStart: 0,
    electricEnd: 0,
    electricPrice: 3500,
    electricAmount: 0,

    // CHỈ SỐ NƯỚC
    waterStart: 0,
    waterEnd: 0,
    waterPrice: 30000,
    waterAmount: 0,

    // TIỀN THUÊ
    rentAmount: 0,

    // PHỤ PHÍ / DỊCH VỤ
    extraFee: 0,
    totalServiceAmount: 0,

    // TỔNG TIỀN
    totalAmount: 0,
    paidAmount: 0,
    remainingAmount: 0,

    dueDate: null,
    note: "",
  });

  const [contracts, setContracts] = useState([]);
  // LOAD HỢP ĐỒNG
  const loadContracts = async () => {
    try {
      const data = await getActiveContracts();
      setContracts(data);
      console.log("Contracts:", data);
    } catch (err) {
      console.error("Lấy danh sách hợp đồng thất bại:", err);
    }
  };

  useEffect(() => {
    loadContracts();
  }, []);

  // LOAD ĐIỆN NƯỚC THEO PHÒNG
  const loadMeter = async (roomId, month, year) => {
    try {
      const res = await getByRoomAndMonthYear(roomId, month, year);

      setFormData((prev) => ({
        ...prev,
        oldElectric: res.oldElectric,
        newElectric: res.newElectric,
        oldWater: res.oldWater,
        newWater: res.newWater,
      }));
    } catch (error) {
      console.error("Lấy chỉ số điện nước thất bại:", error);
    }
  };

  // CHỌN HỢP ĐỒNG
  const handleSelectContract = (contractId) => {
    const contract = contracts.find((c) => c.id === contractId);
    if (!contract) return;

    //Map dịch vụ từ hợp đồng -> bảng dịch vụ
    const mappedItems = contract.contractItems.map((item) => ({
      serviceId: item.serviceId,
      name: item.name,
      price: item.price,
      quantity: 1,
    }));

    // Reset lại dịch vụ theo hợp đồng
    setSelectedServices(mappedItems);

    // Fill dữ liệu hóa đơn
    setFormData((prev) => ({
      ...prev,
      contractId: contract.id,
      roomName: contract.room.roomName,
      tenantName: contract.tenant.tenantName,
      rentAmount: contract.rentPrice,
      electricPrice: contract.electricityPrice,
      waterPrice: contract.waterPrice,
    }));
  };

  // TỰ LOAD ĐIỆN NƯỚC KHI ĐỔI THÁNG / HỢP ĐỒNG
  useEffect(() => {
    if (!formData.contractId || !formData.month || !formData.year) return;

    const contract = contracts.find((c) => c.id === formData.contractId);
    if (!contract?.room?.roomId) return;

    loadMeter(contract.room.roomId, formData.month, formData.year);
  }, [formData.contractId, formData.month, formData.year]);

  // HÀM CẬP NHẬT FORM DATA
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleCreateInvoice = async () => {
    try {
      // bật loading
      setLoading(true);

      // mô phỏng chờ 3 giây trước khi gửi API
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Map selectedServices -> invoiceItems
      const invoiceItems = selectedServices.map((s) => ({
        serviceId: s.serviceId,
        serviceName: s.name,
        price: s.price,
        quantity: s.quantity,
      }));

      // Tạo object theo InvoiceRequest
      const requestData = {
        invoiceCode: formData.invoiceCode,
        contractId: formData.contractId,
        year: formData.year,
        month: formData.month,
        electricStart: formData.electricStart,
        electricEnd: formData.electricEnd,
        waterStart: formData.waterStart,
        waterEnd: formData.waterEnd,
        extraFee: formData.extraFee,
        rentAmount: formData.rentAmount,
        dueDate: formData.dueDate
          ? formData.dueDate.format("YYYY-MM-DD")
          : null,
        note: formData.note,
        invoiceItems,
      };
      console.log(requestData);
      if (invoiceId) {
        // gọi API update
        await updateInvoice(invoiceId, requestData);
        notify({ type: "success", message: "Cập nhật hóa đơn thành công!" });
      } else {
        // tạo mới
        await createInvoice(requestData);
        notify({ type: "success", message: "Tạo hóa đơn thành công!" });
      }
      navigate(path_name.invoice);
    } catch (error) {
      console.error("Đã có lỗi xảy ra:", error);
      notify({ type: "error", message: "Đã có lỗi xảy ra!" });
    } finally {
      setLoading(false);
    }
  };

  // RENDER UI
  return (
    <>
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
            {!invoiceId ? "Tạo hóa đơn mới" : "Cập nhật hóa đơn"}
          </h1>
          <h4 style={{ color: "#536ee7ff" }}>Nhập đầy đủ thông tin hóa đơn</h4>
        </div>

        <Button
          icon={<RollbackOutlined />}
          type="primary"
          ghost
          onClick={() => navigate(path_name.invoice)}
        >
          Quay lại
        </Button>
      </div>

      <MyCard title="Thông tin hóa đơn">
        <Segmented
          block
          value={tab}
          onChange={setTab}
          options={[
            { value: "info", label: "Thông tin", icon: <InfoCircleOutlined /> },
            { value: "water", label: "Nước", icon: <DropboxOutlined /> },
            { value: "electric", label: "Điện", icon: <ThunderboltOutlined /> },
            { value: "service", label: "Dịch vụ", icon: <FileImageOutlined /> },
            {
              value: "summary",
              label: "Tổng kết",
              icon: <CheckCircleOutlined />,
            },
          ]}
        />

        <div style={{ marginTop: 24 }}>
          {tab === "info" && (
            <InfoTab
              contracts={contracts}
              data={formData}
              onSelectContract={handleSelectContract}
              onChange={handleChange}
            />
          )}

          {tab === "water" && (
            <WaterTab data={formData} onChange={handleChange} />
          )}

          {tab === "electric" && (
            <ElectricTab data={formData} onChange={handleChange} />
          )}

          {tab === "service" && (
            <ServiceTab
              servicesSelected={selectedServices}
              setServicesSelected={setSelectedServices}
              notify={notify}
            />
          )}

          {tab === "summary" && (
            <Spin spinning={loading} tip="Đang lưu hóa đơn...">
              <SummaryTab
                data={formData}
                loading={loading}
                servicesSelected={selectedServices}
                invoiceId={invoiceId}
                onChange={handleChange}
                onSubmit={handleCreateInvoice}
                onCancel={() => navigate(path_name.invoice)}
              />
            </Spin>
          )}
        </div>
      </MyCard>

      {contextHolder}
    </>
  );
};

export default InvoiceForm;

const InfoTab = ({ contracts, data, onSelectContract, onChange }) => {
  return (
    <Form layout="vertical">
      <Row gutter={30}>
        <Col span={12}>
          <Form.Item label="Mã hóa đơn:">
            <Input
              value={data.invoiceCode}
              onChange={(e) => onChange("invoiceCode", e.target.value)}
              placeholder="HD-2025-001"
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="Tháng:">
            <InputNumber
              min={1}
              max={12}
              style={{ width: "100%" }}
              value={data.month}
              onChange={(val) => onChange("month", val)}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="Năm:">
            <InputNumber
              style={{ width: "100%" }}
              value={data.year}
              onChange={(val) => onChange("year", val)}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={30}>
        <Col span={12}>
          <Form.Item label="Hợp đồng (đang hoạt động):">
            <Select
              placeholder="Chọn hợp đồng"
              onChange={onSelectContract}
              value={data.contractId}
            >
              {contracts.map((c) => (
                <Select.Option key={c.id} value={c.id}>
                  {c.contractCode}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col span={6}>
          <Form.Item label="Phòng:">
            <Input value={data.roomName} disabled />
          </Form.Item>
        </Col>

        <Col span={6}>
          <Form.Item label="Khách thuê:">
            <Input value={data.tenantName} disabled />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={30}>
        <Col span={12}>
          <Form.Item label="Tiền thuê(VNĐ):">
            <InputNumber
              style={{ width: "100%" }}
              value={data.rentAmount}
              onChange={(v) => onChange("rentAmount", v)}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Hạn thanh toán:">
            <DatePicker
              placeholder="Chọn hạn thanh toán"
              style={{ width: "100%" }}
              value={data.dueDate}
              onChange={(d) => onChange("dueDate", d)}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

const WaterTab = ({ data, onChange }) => (
  <Form layout="vertical">
    <Row gutter={30}>
      <Col span={12}>
        <Form.Item label="Chỉ số ban đầu(m³):">
          <InputNumber
            style={{ width: "100%" }}
            value={data.waterStart}
            onChange={(v) => onChange("waterStart", v)}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="Chỉ số cuối kỳ(m³):">
          <InputNumber
            style={{ width: "100%" }}
            value={data.waterEnd}
            onChange={(v) => onChange("waterEnd", v)}
          />
        </Form.Item>
      </Col>
    </Row>

    <Row gutter={30}>
      <Col span={6}>
        <Form.Item label="Số nước sử dụng(m³):">
          <InputNumber
            style={{ width: "100%" }}
            disabled
            value={data.waterEnd - data.waterStart}
          />
        </Form.Item>
      </Col>
      <Col span={6}>
        <Form.Item label="Giá nước:">
          <InputNumber
            disabled
            value={data.waterPrice}
            onChange={(v) => onChange("waterPrice", v)}
            style={{ width: "100%" }}
            formatter={(v) => formatCurrency(v, true)}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="Tổng tiền nước:">
          <InputNumber
            disabled
            value={data.waterPrice * (data.waterEnd - data.waterStart)}
            onChange={(v) => onChange("waterPrice", v)}
            style={{ width: "100%" }}
            formatter={(v) => formatCurrency(v, true)}
          />
        </Form.Item>
      </Col>
    </Row>
  </Form>
);

const ElectricTab = ({ data, onChange }) => (
  <Form layout="vertical">
    <Row gutter={30}>
      <Col span={12}>
        <Form.Item label="Chỉ số ban đầu(kWh):">
          <InputNumber
            onChange={(v) => onChange("electricStart", v)}
            value={data.electricStart}
            style={{ width: "100%" }}
          />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item label="Chỉ số cuối kỳ(kWh):">
          <InputNumber
            style={{ width: "100%" }}
            value={data.electricEnd}
            onChange={(v) => onChange("electricEnd", v)}
          />
        </Form.Item>
      </Col>
    </Row>

    <Row gutter={30}>
      <Col span={6}>
        <Form.Item label="Số điện sử dụng(kWh):">
          <InputNumber
            disabled
            style={{ width: "100%" }}
            value={data.electricEnd - data.electricStart}
          />
        </Form.Item>
      </Col>
      <Col span={6}>
        <Form.Item label="Giá điện:">
          <InputNumber
            disabled
            style={{ width: "100%" }}
            formatter={(v) => formatCurrency(v, true)}
            value={data.electricPrice}
          />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item label="Tổng tiền điện:">
          <InputNumber
            disabled
            value={data.electricPrice * (data.electricEnd - data.electricStart)}
            onChange={(v) => onChange("electricPrice", v)}
            formatter={(v) => formatCurrency(v, true)}
            style={{ width: "100%" }}
          />
        </Form.Item>
      </Col>
    </Row>
  </Form>
);

const ServiceTab = ({ notify, servicesSelected, setServicesSelected }) => {
  const [services, setServices] = useState([]);

  const fetchServices = async () => {
    try {
      const data = await getServiceAll();
      console.log(data);
      setServices(data);
    } catch (error) {
      console.error("Lấy danh sách dịch vụ thất bại", error);
      setServices([]);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);
  const handleAddService = (serviceId) => {
    const service = services.find((s) => s.id === serviceId);
    if (!service) return;

    const exists = servicesSelected.some((s) => s.serviceId === serviceId);

    if (exists) {
      notify({ type: "warning", message: "Dịch vụ đã tồn tại!" });
      return;
    }

    setServicesSelected((prev) => [
      ...prev,
      {
        serviceId: service.id,
        name: service.name,
        price: service.defaultPrice,
        quantity: 1,
      },
    ]);
  };

  const updatePrice = (index, value) => {
    const copy = [...servicesSelected];
    copy[index].price = value;
    setServicesSelected(copy);
  };
  const updateQuantity = (index, value) => {
    const copy = [...servicesSelected];
    copy[index].quantity = value;
    setServicesSelected(copy);
  };

  const removeService = (index) => {
    setServicesSelected((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <Form layout="vertical">
        <Col span={8}>
          <Form.Item label="Thêm dịch vụ phát sinh:">
            <Select
              placeholder="Chọn dịch vụ cần thêm"
              style={{ width: "100%" }}
              onChange={handleAddService}
            >
              {services.map((s) => (
                <Select.Option key={s.id} value={s.id}>
                  {s.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        {(servicesSelected.length > 0 && (
          <>
            <Table
              dataSource={servicesSelected.map((item, index) => ({
                ...item,
                key: index,
              }))}
              pagination={false}
              size="small"
              columns={[
                {
                  title: "Tên dịch vụ",
                  dataIndex: "name",
                  key: "name",
                  width: "40%",
                  render: (text) => <span>{text}</span>,
                },
                {
                  title: "Giá",
                  dataIndex: "price",
                  key: "price",
                  width: "20%",
                  render: (value, record, index) => (
                    <InputNumber
                      value={value}
                      style={{ width: "100%" }}
                      formatter={(val) =>
                        `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                      }
                      onChange={(val) => updatePrice(index, val)}
                    />
                  ),
                },
                {
                  title: "Số lượng",
                  dataIndex: "quantity",
                  key: "quantity",
                  width: "15%",

                  render: (value, record, index) => (
                    <InputNumber
                      min={1}
                      value={value}
                      style={{ width: "100%" }}
                      onChange={(val) => updateQuantity(index, val)}
                    />
                  ),
                },
                {
                  title: "Tổng tiền",
                  key: "total",
                  width: "20%",

                  render: (_, record) => (
                    <span>
                      {formatCurrency(
                        record.price * record.quantity || 0,
                        true,
                      )}
                    </span>
                  ),
                },
                {
                  key: "action",
                  width: "5%",
                  render: (_, record, index) => (
                    <Button
                      type="text"
                      onClick={() => removeService(index)}
                      icon={<DeleteOutlined />}
                      danger
                    />
                  ),
                },
              ]}
            />
          </>
        )) || (
          <div
            style={{
              border: "1.5px dashed #cfd7ff",
              borderRadius: 10,
              padding: "30px 0",
              textAlign: "center",
              backgroundColor: "#f7f9ff",
              boxShadow: "0 2px 8px rgba(83,110,231,0.08)",
            }}
          >
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div style={{ fontWeight: 600, color: "#536ee7" }}>
                  Chưa có dịch vụ nào!
                </div>
              }
            />
          </div>
        )}
      </Form>
    </>
  );
};
const SummaryTab = ({
  data,
  invoiceId,
  servicesSelected,
  onChange,
  onSubmit,
  onCancel,
  loading,
}) => {
  // ====== ĐIỆN ======
  const electricUsage = data.electricEnd - data.electricStart;
  const electricTotal = electricUsage * data.electricPrice;

  // ====== NƯỚC ======
  const waterUsage = data.waterEnd - data.waterStart;
  const waterTotal = waterUsage * data.waterPrice;

  // ====== DỊCH VỤ ======
  const serviceTotal = servicesSelected.reduce((sum, s) => {
    return sum + s.price * s.quantity;
  }, 0);

  // ====== TỔNG ======
  const total =
    (data.rentAmount || 0) +
    electricTotal +
    waterTotal +
    serviceTotal +
    (data.extraFee || 0);

  const paid = data.paidAmount || 0;
  const remain = total - paid;

  return (
    <>
      <Row gutter={20} style={{ marginTop: 16 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng tiền"
              valueStyle={{ color: "#1677ff" }}
              value={formatCurrency(total || 0, true)}
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card>
            <Statistic
              title="Đã thanh toán"
              valueStyle={{ color: "#52c41a" }}
              value={formatCurrency(paid || 0, true)}
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card>
            <Statistic
              title="Còn lại"
              valueStyle={{ color: "#ff4d4f" }}
              value={formatCurrency(remain || 0, true)}
            />
          </Card>
        </Col>
      </Row>

      {/* ==== FORM ==== */}
      <Card style={{ marginTop: 16 }}>
        <Row gutter={20}>
          <Col span={6}>
            <label>Phụ phí (nếu có):</label>
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              value={data.extraFee}
              onChange={(v) => onChange("extraFee", v)}
            />
          </Col>
          <Col span={18}>
            <label>Ghi chú:</label>
            <Input
              value={data.note}
              placeholder="Nhập ghi chú hóa đơn..."
              onChange={(e) => onChange("note", e.target.value)}
            />
          </Col>
        </Row>
      </Card>

      {/* ==== ACTION ==== */}
      <Row style={{ marginTop: 15, justifyContent: "flex-end" }}>
        <Button onClick={onCancel} style={{ marginRight: 8 }}>
          Huỷ
        </Button>
        <Button type="primary" onClick={onSubmit} loading={loading}>
          {invoiceId ? (
            <>
              <FormOutlined /> Cập nhật hóa đơn
            </>
          ) : (
            <>
              <PlusOutlined /> Tạo hóa đơn
            </>
          )}
        </Button>
      </Row>
    </>
  );
};
