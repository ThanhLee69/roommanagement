import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Row, Col, InputNumber, Checkbox } from "antd";
import { createBuilding, updateBuilding } from "../../api/buildingApi";
import { getAmenities } from "../../api/amenityApi";
import RoomSelect from "../../components/RoomSelect";
import dayjs from "dayjs";
import { createMeterReading } from "../../api/meterApi";
const MeterReadingForm = ({
  isMode,
  record,
  isModal,
  hideModal,
  fetchMeterReadings,
  notify,
  setLoading,
}) => {
  const [form] = Form.useForm();
  const now = dayjs();
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
      };

      setLoading(true);

      if (isMode === "edit") {
        const res = await updateBuilding(record.id, payload);
        notify({
          type: "success",
          message: "Cập nhật thành công!",
          description: res?.message || "Cập nhật tòa nhà thành công!",
        });
      } else {
        await createMeterReading(payload);
        notify({
          type: "success",
          message: "Thêm điện nước thành công!",
        });
      }

      fetchMeterReadings?.();
      hideModal();
      form.resetFields();
    } catch (error) {
      notify({
        type: "error",
        message:
          error?.response?.data?.message ||
          "Đã xảy ra lỗi trong quá trình xử lý tòa nhà.",
      });
      console.error("MeterReadingForm error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        isMode === "edit" ? "Cập nhật điện & nước" : "Thêm điện & nước mới"
      }
      open={isModal}
      onOk={handleSubmit}
      onCancel={hideModal}
      okText={isMode === "edit" ? "Cập nhật" : "Thêm mới"}
      cancelText="Hủy bỏ"
    >
      <Form
        layout="vertical"
        initialValues={{
          ...record,
          month: now.month() + 1, // month() bắt đầu từ 0
          year: now.year(),
        }}
        form={form}
      >
        <Form.Item label="Phòng:" name="roomId">
          <RoomSelect></RoomSelect>
        </Form.Item>
        <Row gutter={20}>
          <Col span={12}>
            <Form.Item label="Tháng:" name="month">
              <InputNumber min={1} max={12} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Năm:" name="year">
              <InputNumber min={2000} max={2100} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={20}>
          <Col span={12}>
            <Form.Item label="Số điện cũ:" name="oldElectric">
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Số điện mới:" name="newElectric">
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={20}>
          <Col span={12}>
            <Form.Item label="Số nước cũ:" name="oldWater">
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Số nước mới:" name="newWater">
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Ghi chú:" name="note">
          <Input.TextArea rows={3} placeholder="Nhập ghi chú..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MeterReadingForm;
