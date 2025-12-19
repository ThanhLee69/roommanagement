import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Row,
  Col,
  Checkbox,
  Segmented,
  Button,
} from "antd";
import { InfoCircleOutlined, FileImageOutlined } from "@ant-design/icons";
import ImageUploader from "./RoomImageUpload";
import { getRoomAmenities } from "../../api/amenityApi";
import { createRoom, updateRoom } from "../../api/roomApi";
import {
  deleteRoomImage,
  deleteRoomImages,
  uploadRoomImages,
} from "../../api/roomImageApi";
import { ROOM_STATUS_OPTIONS, ROOM_TYPE_OPTIONS } from "../../constants/labels";
import BuildingSelect from "../../components/BuildingSelect";
const { Option } = Select;

const RoomForm = ({
  isMode,
  record,
  hideModal,
  isModal,
  fetchRooms,
  notify,
  buildings,
  loadDashboard,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [amenities, setAmenities] = useState([]);
  const [tab, setTab] = useState("info");
  const [fileList, setFileList] = useState([]);
  const [deletedIds, setDeletedIds] = useState([]);
  const handleRemoveImage = (file) => {
    if (file.id) setDeletedIds((prev) => [...prev, file.id]); // ảnh cũ
    setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
  };
  useEffect(() => {
    const fetchAmenities = async () => {
      const res = await getRoomAmenities();
      setAmenities(res);
    };
    fetchAmenities();
  }, []);
  useEffect(() => {
    if (!record || amenities.length === 0) return;

    const buildingId = record?.buildingName
      ? buildings.find((b) => b.name === record.buildingName)?.id
      : undefined;

    const amenityIds = record?.amenityNames
      ? amenities
          .filter((a) => record.amenityNames.includes(a.name))
          .map((a) => a.id)
      : [];

    form.setFieldsValue({
      ...record,
      buildingId,
      amenities: amenityIds,
    });
    if (record.images && record.images.length > 0) {
      const oldFiles = record.images.map((img, index) => ({
        uid: `old-${img.id ?? index}`,
        name: `image-${index}.jpg`,
        status: "done",
        url: img.imageUrl,
        id: img.id,
      }));
      setFileList(oldFiles);
    } else {
      setFileList([]);
    }
  }, [record, amenities, buildings]);

  const handleCreate = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const payload = {
        name: values.name,
        roomType: values.roomType,
        floor: Number(values.floor),
        area: Number(values.area),
        rentalPrice: Number(values.rentalPrice),
        maxOccupancy: Number(values.maxOccupancy),
        status: values.status,
        description: values.description,
        buildingId: values.buildingId,
        amenityIds: values.amenities || [],
      };

      const res = await createRoom(payload);

      const roomId = res?.result?.id || res?.id;

      if (!roomId) {
        throw new Error("Không lấy được ID phòng sau khi tạo.");
      }
      const newFiles = fileList.filter((f) => !f.url && f.originFileObj);

      if (newFiles.length > 0) {
        await uploadRoomImages(
          roomId,
          newFiles.map((f) => f.originFileObj),
        );
      }
      notify({
        type: "success",
        message: "Thành công!",
        description: "Thêm phòng thành công.",
      });
      fetchRooms();
      loadDashboard();
      hideModal();
      form.resetFields();
      setFileList([]);
    } catch (error) {
      notify({
        type: "error",
        message:
          error?.response?.data?.message ||
          error.message ||
          "Có lỗi xảy ra trong quá trình thêm phòng.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        name: values.name,
        roomType: values.roomType,
        floor: Number(values.floor),
        area: Number(values.area),
        rentalPrice: Number(values.rentalPrice),
        maxOccupancy: Number(values.maxOccupancy),
        status: values.status,
        description: values.description,
        buildingId: values.buildingId,
        amenityIds: values.amenities || [],
      };

      setLoading(true);
      await updateRoom(record.id, payload);
      // Xóa ảnh cũ đã chọn xóa
      if (deletedIds.length > 0) {
        await deleteRoomImages(deletedIds);
      }

      // Upload ảnh mới
      const newFiles = fileList.filter((f) => !f.url && f.originFileObj);
      if (newFiles.length > 0) {
        await uploadRoomImages(
          record.id,
          newFiles.map((f) => f.originFileObj),
        );
      }

      notify({
        type: "success",
        message: "Cập nhật thành công!",
      });

      fetchRooms();
      loadDashboard();
      hideModal();
      form.resetFields();
    } catch (error) {
      notify({
        type: "error",
        message: error?.response?.data?.message || "Có lỗi khi cập nhật phòng.",
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
          {isMode === "edit" ? "Cập nhật phòng" : "Thêm phòng mới"}
        </div>
      }
      open={isModal}
      onCancel={hideModal}
      footer={
        tab === "info"
          ? [
              <Button key="cancel" type="dashed" onClick={hideModal}>
                Hủy bỏ
              </Button>,
              <Button
                key="submit"
                type="primary"
                onClick={isMode === "edit" ? handleUpdate : handleCreate}
                loading={loading}
              >
                {isMode === "edit" ? "Cập nhật" : "Thêm mới"}
              </Button>,
            ]
          : null
      }
    >
      <Segmented
        value={tab}
        onChange={setTab}
        options={[
          { value: "info", label: "Thông tin", icon: <InfoCircleOutlined /> },
          { value: "images", label: "Ảnh phòng", icon: <FileImageOutlined /> },
        ]}
        style={{
          marginBottom: 20,
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
        block
      />

      {tab === "info" && (
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Tên phòng"
                name="name"
                rules={[
                  { required: true, message: "Vui lòng nhập tên phòng!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Tòa nhà"
                name="buildingId"
                rules={[{ required: true, message: "Vui lòng chọn tòa nhà!" }]}
              >
                <BuildingSelect />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Tầng" name="floor" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Diện tích (m²)"
                name="area"
                rules={[{ required: true }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Giá thuê (₫)"
                name="rentalPrice"
                rules={[{ required: true }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Sức chứa"
                name="maxOccupancy"
                rules={[{ required: true }]}
              >
                <InputNumber min={1} style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Loại phòng"
                name="roomType"
                rules={[{ required: true }]}
              >
                <Select allowClear placeholder="Chọn loại phòng">
                  {ROOM_TYPE_OPTIONS.map((status) => (
                    <Option key={status.value} value={status.value}>
                      {status.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Trạng thái"
                name="status"
                rules={[{ required: true }]}
              >
                <Select allowClear placeholder="Chọn trạng thái">
                  {ROOM_STATUS_OPTIONS.map((status) => (
                    <Option key={status.value} value={status.value}>
                      {status.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={3} />
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
      )}

      {tab === "images" && (
        <ImageUploader
          fileList={fileList}
          setFileList={setFileList}
          onRemove={(file) => handleRemoveImage(file)}
        />
      )}
    </Modal>
  );
};

export default RoomForm;
