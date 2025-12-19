import { Descriptions, Divider, Tag, List, Typography, Row, Col } from "antd";

export default function InvoicePreview({ invoice }) {
  if (!invoice) return null;

  const electricUsage = invoice.electricEnd - invoice.electricStart;
  const waterUsage = invoice.waterEnd - invoice.waterStart;
  // .invoice-container {
  //   width: 100%;
  //   max-width: 500px;
  //   margin: auto;
  //   background: white;
  //   padding: 24px;
  //   border-radius: 10px;
  //   box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  //   font-family: Arial, sans-serif;
  // }
  return (
    <div className="invoice-card">
      <Typography.Title level={4} align="center" style={{ marginBottom: 0 }}>
        HÓA ĐƠN THUÊ PHÒNG
      </Typography.Title>
      <Typography.Text
        type="secondary"
        style={{ display: "block", textAlign: "center" }}
      >
        {invoice.invoiceCode}
      </Typography.Text>

      <Divider />

      {/* ---------------- THÔNG TIN CHUNG ---------------- */}
      {/* <Typography.Text strong>Thông tin chung</Typography.Text> */}
      <Descriptions
        bordered
        size="small"
        column={2}
        contentStyle={{ fontWeight: 500 }}
      >
        <Descriptions.Item label="Phòng">{invoice.roomName}</Descriptions.Item>

        <Descriptions.Item label="Tháng/Năm">
          {invoice.month}/{invoice.year}
        </Descriptions.Item>

        <Descriptions.Item label="Khách thuê">
          {invoice.tenantName}
        </Descriptions.Item>

        <Descriptions.Item label="Hạn thanh toán">
          {invoice.dueDate}
        </Descriptions.Item>

        <Descriptions.Item label="Hợp đồng">
          {invoice.contractCode}
        </Descriptions.Item>

        <Descriptions.Item label="Trạng thái">
          <Tag color={invoice.invoiceStatus === "PAID" ? "green" : "red"}>
            {invoice.invoiceStatus === "PAID"
              ? "Đã thanh toán"
              : "Chưa thanh toán"}
          </Tag>
        </Descriptions.Item>
      </Descriptions>

      {/* ---------------- ĐIỆN NƯỚC ---------------- */}
      <Divider orientation="left">Chỉ số điện nước</Divider>

      <Row gutter={16} style={{ marginTop: 8 }}>
        <Col span={12}>
          <List
            size="small"
            header={<b>Điện</b>}
            bordered
            dataSource={[
              `Chỉ số đầu: ${invoice.electricStart} kWh`,
              `Chỉ số cuối: ${invoice.electricEnd} kWh`,
              `Sử dụng: ${electricUsage} kWh`,
            ]}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </Col>

        <Col span={12}>
          <List
            size="small"
            header={<b>Nước</b>}
            bordered
            dataSource={[
              `Chỉ số đầu: ${invoice.waterStart} m³`,
              `Chỉ số cuối: ${invoice.waterEnd} m³`,
              `Sử dụng: ${waterUsage} m³`,
            ]}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </Col>
      </Row>

      {/* ---------------- CHI TIẾT TIỀN ---------------- */}
      <Divider orientation="left">Chi tiết hóa đơn</Divider>

      <List
        size="small"
        // style={{ marginTop: 3 }}
        dataSource={[
          { label: "Tiền phòng", value: invoice.rentAmount },

          {
            label: `Tiền điện (${electricUsage} kWh)`,
            value: invoice.electricAmount,
          },

          {
            label: `Tiền nước (${waterUsage} m³)`,
            value: invoice.waterAmount,
          },

          ...invoice.invoiceItems.map((s) => ({
            label: s.serviceName,
            value: s.price * s.quantity,
          })),
        ]}
        renderItem={(item) => (
          <List.Item>
            <Row style={{ width: "100%" }}>
              <Col span={16}>{item.label}</Col>
              <Col span={8} style={{ textAlign: "right" }}>
                {item.value.toLocaleString()} đ
              </Col>
            </Row>
          </List.Item>
        )}
      />

      <Divider />

      {/* ---------------- TỔNG TIỀN ---------------- */}
      <Row>
        <Col span={16}>
          <b>Tổng tiền</b>
        </Col>
        <Col span={8} style={{ textAlign: "right", fontWeight: "bold" }}>
          {invoice.totalAmount.toLocaleString()} đ
        </Col>
      </Row>

      <Row>
        <Col span={16}>Đã thanh toán</Col>
        <Col span={8} style={{ textAlign: "right", color: "green" }}>
          {invoice.paidAmount.toLocaleString()} đ
        </Col>
      </Row>

      <Row>
        <Col span={16}>
          <b>Còn lại</b>
        </Col>
        <Col span={8} style={{ textAlign: "right", color: "red" }}>
          {invoice.remainingAmount.toLocaleString()} đ
        </Col>
      </Row>
      {!invoice.note.toLocaleString() == "" && (
        <Row>
          <Col span={16}>Ghi chú</Col>
          <Col span={8} style={{ textAlign: "right" }}>
            {invoice.note.toLocaleString()}
          </Col>
        </Row>
      )}
    </div>
  );
}
