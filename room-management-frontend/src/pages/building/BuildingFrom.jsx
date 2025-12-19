import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Row, Col, InputNumber, Checkbox } from "antd";
import { createBuilding, updateBuilding } from "../../api/buildingApi";
import { getAmenities, getBuildingAmenities } from "../../api/amenityApi";

const BuildingForm = ({
  isMode,
  record,
  isModal,
  hideModal,
  fetchBuilding,
  notify,
  setLoading,
}) => {
  const [form] = Form.useForm();
  const [amenities, setAmenities] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const buildingAmenities = await getBuildingAmenities();
      setAmenities(buildingAmenities);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (isMode === "edit" && record) {
      const selectedAmenityIds = amenities
        .filter((a) => record.amenityNames?.includes(a.name))
        .map((a) => a.id);
      form.setFieldsValue({
        ...record,
        amenities: selectedAmenityIds,
      });
    } else {
      form.resetFields();
    }
  }, [isMode, record, amenities, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        name: values.name.trim(),
        address: values.address.trim(),
        description: values.description?.trim() || "",
        numberOfFloors: Number(values.numberOfFloors),
        area: Number(values.area),
        amenityIds: values.amenities || [],
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
        await createBuilding(payload);
        notify({
          type: "success",
          message: "Thêm tòa nhà thành công!",
        });
      }

      fetchBuilding?.();
      hideModal();
      form.resetFields();
    } catch (error) {
      notify({
        type: "error",
        message:
          error?.response?.data?.message ||
          "Đã xảy ra lỗi trong quá trình xử lý tòa nhà.",
      });
      console.error("BuildingForm error:", error);
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
          {isMode === "edit" ? "Cập nhật tòa nhà" : "Thêm tòa nhà mới"}
        </div>
      }
      open={isModal}
      onOk={handleSubmit}
      onCancel={hideModal}
      okText={isMode === "edit" ? "Cập nhật" : "Thêm mới"}
      cancelText="Hủy bỏ"
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Tên tòa nhà:"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
        >
          <Input placeholder="Nhập tên..." />
        </Form.Item>

        <Form.Item
          label="Địa chỉ:"
          name="address"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
        >
          <Input placeholder="Nhập địa chỉ..." />
        </Form.Item>

        <Row gutter={20}>
          <Col span={12}>
            <Form.Item
              label="Số tầng:"
              name="numberOfFloors"
              rules={[{ required: true, message: "Vui lòng nhập số tầng!" }]}
            >
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Diện tích(m²):"
              name="area"
              rules={[{ required: true, message: "Vui lòng nhập diện tích!" }]}
            >
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Mô tả:" name="description">
          <Input.TextArea rows={4} placeholder="Nhập mô tả..." />
        </Form.Item>

        <Form.Item label="Tiện ích chung:" name="amenities">
          <Checkbox.Group style={{ width: "100%" }}>
            <Row>
              {amenities.map((item) => (
                <Col span={8} key={item.id}>
                  <Checkbox value={item.id}>{item.name}</Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BuildingForm;
