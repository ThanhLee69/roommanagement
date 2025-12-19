import React, { useEffect } from "react";
import { Modal, Form, Input, Select, Col, Row } from "antd";
import { createUser, updateUser } from "../../api/userApi";
import { ROLE_OPTIONS, STATUS_OPTIONS } from "../../constants/labels";

const UserForm = ({
  isMode,
  record,
  isModal,
  hideModal,
  fetchUsers,
  notify,
  setLoading,
}) => {
  const [form] = Form.useForm();

  //   useEffect(() => {
  //     if (isMode === "edit" && record) {
  //       form.setFieldsValue({
  //         fullName: record.fullName,
  //         username: record.username,
  //         email: record.email,
  //         phoneNumber: record.phoneNumber,
  //         role: record.role,
  //         status: record.status,
  //       });
  //     } else {
  //       form.resetFields();
  //     }
  //   }, [isMode, record, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        fullName: values.fullName.trim(),
        username: values.username.trim(),
        email: values.email.trim(),
        phoneNumber: values.phoneNumber.trim(),
        role: values.role,
        status: values.status,
      };

      // Thêm password khi tạo mới
      if (isMode === "add" && values.password) {
        payload.password = values.password;
      }

      setLoading(true);

      if (isMode === "edit") {
        await updateUser(record.id, payload);
        notify({
          type: "success",
          message: "Cập nhật thành công!",
        });
      } else {
        await createUser(payload);
        notify({
          type: "success",
          message: "Thêm người dùng thành công!",
        });
      }
      hideModal();
      fetchUsers();
      form.resetFields();
    } catch (error) {
      notify({
        type: "error",
        message:
          error?.response?.data?.message ||
          "Đã xảy ra lỗi trong quá trình xử lý người dùng.",
      });
      console.error("UserForm error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <div style={{ textAlign: "center", color: "#536ee7", fontSize: 18 }}>
          {isMode === "edit" ? "Cập nhật người dùng" : "Thêm người dùng mới"}
        </div>
      }
      open={isModal}
      onOk={handleSubmit}
      onCancel={hideModal}
      okText={isMode === "edit" ? "Cập nhật" : "Thêm mới"}
      cancelText="Hủy bỏ"
    >
      <Form layout="vertical" form={form} initialValues={{ ...record }}>
        <Form.Item
          label="Họ và tên"
          name="fullName"
          rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
        >
          <Input placeholder="Nhập họ và tên..." />
        </Form.Item>
        {!isMode || isMode === "add" ? (
          <Row gutter={15}>
            <Col span={12}>
              <Form.Item
                label="Tên đăng nhập"
                name="username"
                rules={[{ required: true, message: "Vui lòng nhập username!" }]}
              >
                <Input placeholder="Nhập username..." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
              >
                <Input.Password placeholder="Nhập mật khẩu..." />
              </Form.Item>
            </Col>
          </Row>
        ) : null}

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input placeholder="Nhập email..." />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phoneNumber"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
        >
          <Input placeholder="Nhập số điện thoại..." />
        </Form.Item>

        <Row gutter={15}>
          <Col span={12}>
            <Form.Item
              label="Vai trò"
              name="role"
              rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
            >
              <Select options={ROLE_OPTIONS} placeholder="Chọn vai trò..." />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Trạng thái"
              name="status"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
            >
              <Select
                options={STATUS_OPTIONS}
                placeholder="Chọn trạng thái..."
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default UserForm;
