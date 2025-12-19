import {
  Modal,
  Form,
  InputNumber,
  Select,
  DatePicker,
  Typography,
  Divider,
  Input,
  message,
  Row,
  Col,
} from "antd";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import { PAYMENT_METHOD_OPTIONS } from "../../constants/labels";
import { createPayment, updatePayment } from "../../api/paymentApi";
import { getAllInvoicesForPayment } from "../../api/invoiceApi";

const { Text, Title } = Typography;

const PaymentForm = ({
  isMode,
  record,
  hideModal,
  isModal,
  fetchPayments,
  notify,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // LOAD INVOICE LIST
  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const data = await getAllInvoicesForPayment();
        setInvoices(data);
      } catch (err) {
        message.error("Lỗi tải danh sách hóa đơn!");
      }
    };
    loadInvoices();
  }, []);

  // HANDLE SELECT INVOICE
  const handleSelectInvoice = (invoiceId) => {
    const invoice = invoices.find((i) => i.id === invoiceId);
    if (invoice) {
      setSelectedInvoice(invoice);

      form.setFieldsValue({
        paymentAmount: invoice.remainingAmount,
        paymentMethod: "CASH",
        paymentDate: dayjs(),
        note: "",
      });
    }
  };

  const handleSubmit = async (mode) => {
    try {
      const values = await form.validateFields();

      if (!selectedInvoice) {
        return message.error("Vui lòng chọn hóa đơn!");
      }

      const payload = {
        ...values,
        invoiceId: selectedInvoice.id,
        paymentDate: values.paymentDate.format("YYYY-MM-DD"),
      };

      setLoading(true);

      if (mode === "create") {
        await createPayment(payload);
        notify({ type: "success", message: "Thanh toán hóa đơn thành công!" });
      } else {
        await updatePayment(record.id, payload);
        notify({ type: "success", message: "Cập nhật thanh toán thành công!" });
      }

      hideModal();
      fetchPayments();
      form.resetFields();
      setSelectedInvoice(null);
    } catch (err) {
      message.error("Thanh toán thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <div style={{ textAlign: "center", color: "#3a57e8", fontSize: 18 }}>
          {isMode === "edit" ? "Cập nhật thanh toán" : "Thanh toán hóa đơn"}
        </div>
      }
      open={isModal}
      onCancel={hideModal}
      onOk={() => handleSubmit(isMode === "edit" ? "edit" : "create")}
      okText={isMode === "edit" ? "Cập nhật" : "Xác nhận thanh toán"}
      cancelText="Hủy"
      confirmLoading={loading}
      width={520}
    >
      {/* SELECT INVOICE */}
      <Form form={form} layout="vertical">
        <Form.Item
          label={<b>Hóa đơn:</b>}
          name="invoiceId"
          rules={[{ required: true, message: "Vui lòng chọn hóa đơn" }]}
        >
          <Select
            showSearch
            allowClear
            placeholder="Chọn hóa đơn cần thanh toán"
            onChange={handleSelectInvoice}
            options={invoices.map((i) => ({
              value: i.id,
              label: `${i.invoiceCode} - ${i.roomName} - Nợ: ${i.remainingAmount.toLocaleString()}đ`,
            }))}
          />
        </Form.Item>

        {selectedInvoice && (
          <div
            style={{
              padding: 12,
              borderRadius: 8,
              background: "#fafafa",
              marginBottom: 12,
              border: "1px solid #eee",
            }}
          >
            <Text strong>Mã hóa đơn:</Text> {selectedInvoice.invoiceCode} <br />
            <Text strong>Tháng/Năm:</Text> {selectedInvoice.month}/
            {selectedInvoice.year} <br />
            <Text strong>Phòng:</Text> {selectedInvoice.roomName} <br />
            <Text strong>Người thuê:</Text> {selectedInvoice.tenantName} <br />
            <Text strong>Tổng tiền:</Text>{" "}
            {selectedInvoice.totalAmount.toLocaleString()} đ <br />
            <Text strong>Đã thanh toán:</Text>{" "}
            <Text type="success">
              {selectedInvoice.paidAmount.toLocaleString()} đ
            </Text>{" "}
            <br />
            <Text strong>Còn lại:</Text>{" "}
            <Text type="danger">
              {selectedInvoice.remainingAmount.toLocaleString()} đ
            </Text>
          </div>
        )}

        {/* <Divider /> */}

        <Form.Item
          label="Số tiền thanh toán (VND):"
          name="paymentAmount"
          rules={[{ required: true, message: "Nhập số tiền" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={1}
            max={selectedInvoice?.remainingAmount || 1}
            placeholder="Nhập số tiền thanh toán"
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Phương thức thanh toán:"
              name="paymentMethod"
              rules={[{ required: true }]}
            >
              <Select
                options={PAYMENT_METHOD_OPTIONS}
                placeholder="Chọn phương thức thanh toán"
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Ngày thanh toán:"
              name="paymentDate"
              rules={[{ required: true }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Ghi chú:" name="note">
          <Input.TextArea rows={3} placeholder="Ghi chú nếu có..." />
        </Form.Item>

        {selectedInvoice && (
          <div style={{ marginTop: 10, fontSize: 15 }}>
            💡 Tối đa có thể thanh toán:{" "}
            <b>{selectedInvoice.remainingAmount.toLocaleString()} đ</b>
          </div>
        )}
      </Form>
    </Modal>
  );
};

export default PaymentForm;
