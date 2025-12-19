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
import { createPayment } from "../../api/paymentApi";

const { Text } = Typography;

const PayInvoiceModal = ({ open, onClose, invoice, reload, notify }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && invoice) {
      form.setFieldsValue({
        paymentAmount: invoice.remainingAmount,
        paymentMethod: "CASH",
        paymentDate: dayjs(),
        note: "",
      });
    }
  }, [open, invoice]);
  if (!invoice) return null;
  const remain = invoice.remainingAmount || 0;
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (values.paymentAmount > remain) {
        message.error("Số tiền không được vượt quá số còn lại");
        return;
      }

      const payload = {
        ...values,
        invoiceId: invoice.id,
        paymentDate: values.paymentDate.format("YYYY-MM-DD"),
      };

      setLoading(true);
      await createPayment(payload);

      notify({ type: "success", message: "Thanh toán hóa đơn thành công!" });
      onClose();
      reload();
      form.resetFields();
    } catch (err) {
      message.error("Thanh toán thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Xác nhận thanh toán"
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Xác nhận thanh toán"
      cancelText="Hủy bỏ"
      confirmLoading={loading}
      width={500}
    >
      <div style={{ lineHeight: 1.8 }}>
        <Text strong>Mã hóa đơn:</Text> {invoice.invoiceCode} <br />
        <Text strong>Tháng/Năm:</Text> {invoice.month}/{invoice.year} <br />
        <Text strong>
          Tổng tiền:
        </Text> {invoice.totalAmount.toLocaleString()} đ <br />
        <Text strong>Đã thanh toán:</Text>{" "}
        <Text type="success">{invoice.paidAmount.toLocaleString()} đ</Text>
        <br />
        <Text strong>Còn lại:</Text>{" "}
        <Text type="danger">{remain.toLocaleString()} đ</Text>
      </div>

      <Divider />

      <Form form={form} layout="vertical">
        <Form.Item
          label="Số tiền thanh toán (VND)"
          name="paymentAmount"
          rules={[{ required: true, message: "Nhập số tiền" }]}
        >
          <InputNumber style={{ width: "100%" }} min={1} max={remain} />
        </Form.Item>

        <Row gutter={20}>
          <Col span={12}>
            <Form.Item
              label="Phương thức thanh toán"
              name="paymentMethod"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Chọn phương thức thanh toán"
                options={PAYMENT_METHOD_OPTIONS}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Ngày thanh toán"
              name="paymentDate"
              rules={[{ required: true }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Ghi chú" name="note">
          <Input.TextArea placeholder="Ghi chú nếu có..." rows={3} />
        </Form.Item>

        <h4>
          💡 Tối đa có thể thanh toán: <b>{remain.toLocaleString()} đ</b>
        </h4>
      </Form>
    </Modal>
  );
};

export default PayInvoiceModal;
