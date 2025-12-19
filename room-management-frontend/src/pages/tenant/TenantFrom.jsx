import React, { useState } from "react";
import { Modal, Form, Input, Row, Col, DatePicker, Radio } from "antd";
import { createTenant, updateTenant } from "../../api/tenantApi";
import dayjs from "dayjs";
import { GENDER_OPTIONS } from "../../constants/labels";

const TenantForm = ({
  isMode,
  record,
  hideModal,
  isModal,
  fetchTenants,
  notify,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (mode) => {
    try {
      const values = await form.validateFields();

      const payload = {
        fullName: values.fullName,
        phoneNumber: values.phoneNumber,
        email: values.email,
        cccd: values.cccd,
        dateOfBirth: values.dateOfBirth
          ? values.dateOfBirth.format("YYYY-MM-DD")
          : null,
        gender: values.gender,
        permanentAddress: values.permanentAddress,
        occupation: values.occupation,
        vehicleNumber: values.vehicleNumber,
        status: "NOT_RENTED",
      };
      setLoading(true);
      if (mode === "create") {
        await createTenant(payload);
        notify({
          type: "success",
          message: "Thêm khách thuê thành công!",
        });
      } else if (mode === "edit") {
        await updateTenant(record.id, payload);
        notify({
          type: "success",
          message: "Cập nhật khách thuê thành công!",
        });
      }

      fetchTenants?.();
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

  return (
    <Modal
      title={
        <div
          style={{ textAlign: "center", color: "#536ee7", fontSize: "18px" }}
        >
          {isMode === "edit" ? "Cập nhật khách thuê" : "Thêm khách thuê mới"}
        </div>
      }
      open={isModal}
      onOk={() => handleSubmit(isMode === "edit" ? "edit" : "create")}
      onCancel={hideModal}
      okText={isMode === "edit" ? "Cập nhật" : "Thêm mới"}
      cancelText="Hủy bỏ"
      confirmLoading={loading}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          ...record,
          dateOfBirth: record?.dateOfBirth ? dayjs(record.dateOfBirth) : null,
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Họ tên:" name="fullName">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Số điện thoại:" name="phoneNumber">
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="Email:" name="email">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="CCCD:" name="cccd">
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="Ngày sinh:" name="dateOfBirth">
              <DatePicker
                style={{ width: "100%" }}
                placeholder="Chọn ngày sinh"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Giới tính:" name="gender">
              <Radio.Group block options={GENDER_OPTIONS} />
            </Form.Item>
          </Col>
        </Row>
        <Col>
          <Form.Item label="Địa chỉ thường trú:" name="permanentAddress">
            <Input />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item label="Nghề nghiệp:" name="occupation">
            <Input />
          </Form.Item>
        </Col>
      </Form>
    </Modal>
  );
};

export default TenantForm;
