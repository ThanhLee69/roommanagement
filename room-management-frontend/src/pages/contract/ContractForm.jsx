import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Row,
  Col,
  DatePicker,
  InputNumber,
  Select,
  Button,
} from "antd";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { createContract, updateContract } from "../../api/contractApi";
import RoomSelect from "../../components/RoomSelect";
import TenantSelect from "../../components/TenantSelect";
import ServiceSelect from "../../components/ServiceSelect";
import { getServiceAll } from "../../api/serviceApi";
import {
  CONTRACT_STATUS_OPTIONS,
  PAYMENT_CYCLE_OPTIONS,
} from "../../constants/labels";

const { Option } = Select;

const ContractForm = ({
  isMode,
  record,
  hideModal,
  isModal,
  fetchContracts,
  notify,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);

  const handleSubmit = async (mode) => {
    try {
      const values = await form.validateFields();

      const payload = {
        ...values,

        // format ngày
        startDate: values.startDate
          ? values.startDate.format("YYYY-MM-DD")
          : null,
        endDate: values.endDate ? values.endDate.format("YYYY-MM-DD") : null,

        contractItems: selectedServices.map((s) => ({
          serviceId: s.serviceId,
          price: s.price,
        })),
      };

      console.log("PAYLOAD:", payload);

      setLoading(true);

      if (mode === "create") {
        await createContract(payload);
        notify({ type: "success", message: "Thêm hợp đồng thành công!" });
      } else {
        await updateContract(record.id, payload);
        notify({ type: "success", message: "Cập nhật hợp đồng thành công!" });
      }

      fetchContracts();
      hideModal();
      form.resetFields();
    } catch (error) {
      notify({
        type: "error",
        message:
          error?.response?.data?.message ||
          error.message ||
          "Có lỗi xảy ra trong quá trình xử lý.",
      });
    } finally {
      setLoading(false);
    }
  };

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

  console.log(selectedServices);
  const handleAddService = (serviceId) => {
    const service = services.find((s) => s.id === serviceId);
    if (!service) return;

    const exists = selectedServices.some((s) => s.serviceId === serviceId);

    if (exists) {
      notify({
        type: "warning",
        message: "Dịch vụ này đã được thêm rồi!",
      });
      return;
    }

    setSelectedServices((prev) => [
      ...prev,
      {
        serviceId: service.id,
        name: service.name,
        price: service.defaultPrice,
      },
    ]);
  };

  const updatePrice = (index, value) => {
    const copy = [...selectedServices];
    copy[index].price = value;
    setSelectedServices(copy);
  };

  const removeService = (index) => {
    setSelectedServices((prev) => prev.filter((_, i) => i !== index));
  };
  const chunk = (arr, size = 2) => {
    const res = [];
    for (let i = 0; i < arr.length; i += size) {
      res.push(arr.slice(i, i + size));
    }
    return res;
  };
  const rows = chunk(selectedServices, 2);

  useEffect(() => {
    if (isMode === "edit" && record?.contractItems) {
      const mappedServices = record.contractItems.map((item) => ({
        serviceId: item.serviceId,
        name: item.name,
        price: item.price,
      }));

      setSelectedServices(mappedServices);
    } else {
      setSelectedServices([]);
    }
  }, [record, isMode]);

  return (
    <Modal
      title={
        <div
          style={{ textAlign: "center", color: "#536ee7", fontSize: "18px" }}
        >
          {isMode === "edit" ? "Cập nhật hợp đồng" : "Thêm hợp đồng mới"}
        </div>
      }
      open={isModal}
      onOk={() => handleSubmit(isMode === "edit" ? "edit" : "create")}
      onCancel={hideModal}
      okText={isMode === "edit" ? "Cập nhật" : "Thêm mới"}
      cancelText="Hủy bỏ"
      confirmLoading={loading}
      width={900}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          ...record,
          startDate: record?.startDate ? dayjs(record.startDate) : null,
          endDate: record?.endDate ? dayjs(record.endDate) : null,
          roomId: record?.room?.roomId,
          tenantId: record?.tenant?.tenantId,
        }}
      >
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              label="Mã hợp đồng:"
              name="contractCode"
              rules={[{ required: true, message: "Vui lòng nhập mã hợp đồng" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={9}>
            <Form.Item
              label="Phòng (trống):"
              name="roomId"
              rules={[{ required: true, message: "Vui lòng chọn phòng" }]}
            >
              <RoomSelect placeholder="Chọn phòng" style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={9}>
            <Form.Item
              label="Người thuê đại diện:"
              name="tenantId"
              rules={[{ required: true, message: "Vui lòng chọn người thuê" }]}
            >
              <TenantSelect />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Ngày bắt đầu:"
              name="startDate"
              rules={[
                { required: true, message: "Vui lòng chọn ngày bắt đầu" },
              ]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Ngày kết thúc:"
              name="endDate"
              rules={[
                { required: true, message: "Vui lòng chọn ngày kết thúc" },
              ]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Chu kỳ thanh toán:"
              name="paymentCycle"
              rules={[{ required: true }]}
            >
              <Select placeholder="Chọn chu kỳ thanh toán">
                {PAYMENT_CYCLE_OPTIONS.map((item) => (
                  <Option key={item.value} value={item.value}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={5}>
            <Form.Item label="Ngày thanh toán:" name="paymentDay">
              <InputNumber style={{ width: "100%" }} min={1} max={31} />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item
              label="Tiền thuê:"
              name="rentPrice"
              rules={[{ required: true, message: "Vui lòng nhập tiền thuê" }]}
            >
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item
              label="Tiền cọc:"
              name="deposit"
              rules={[{ required: true, message: "Vui lòng nhập tiền cọc" }]}
            >
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item label="Số người tối đa:" name="maxOccupants">
              <InputNumber style={{ width: "100%" }} min={1} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item label="Tiền điện:" name="electricityPrice">
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Tiền nước:" name="waterPrice">
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Trạng thái hợp đồng"
              name="status"
              rules={[{ required: true }]}
            >
              <Select placeholder="Chọn trạng thái">
                {CONTRACT_STATUS_OPTIONS.map((item) => (
                  <Option key={item.value} value={item.value}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Dịch vụ đi kèm:">
              <Select
                placeholder="Chọn dịch vụ đi kèm"
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
        </Row>

        <Col>
          <Form.Item label="Điều khoản:" name="notes">
            <Input.TextArea rows={4} />
          </Form.Item>
        </Col>
        {selectedServices.length > 0 && (
          <>
            <div style={{ marginTop: 10, fontWeight: 600 }}>
              Dịch vụ kèm theo:
            </div>

            <div
              style={{
                maxHeight: 85,
                overflowY: "auto",
                overflowX: "hidden",
                paddingRight: 8,
                borderRadius: 6,
              }}
            >
              {rows.map((row, rowIndex) => (
                <Row gutter={12} key={rowIndex} style={{ marginTop: 10 }}>
                  {row.map((item, colIndex) => {
                    const realIndex = rowIndex * 2 + colIndex;

                    return (
                      <Col span={12} key={realIndex}>
                        <Row gutter={8} align="middle">
                          <Col span={14}>
                            <Input value={item.name} disabled />
                          </Col>

                          <Col span={7}>
                            <InputNumber
                              value={item.price}
                              style={{ width: "100%" }}
                              formatter={(value) =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                              }
                              onChange={(val) => updatePrice(realIndex, val)}
                            />
                          </Col>

                          <Col span={3}>
                            <Button
                              danger
                              onClick={() => removeService(realIndex)}
                            >
                              X
                            </Button>
                          </Col>
                        </Row>
                      </Col>
                    );
                  })}
                </Row>
              ))}
            </div>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default ContractForm;
