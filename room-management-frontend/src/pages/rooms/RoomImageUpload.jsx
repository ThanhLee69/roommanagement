import React from "react";
import { Upload, Button, Image, Row, Col, Card } from "antd";
import {
  UploadOutlined,
  ProfileOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { PiImage } from "react-icons/pi";

const ImageUploader = ({ fileList = [], setFileList, onRemove = () => {} }) => {
  const onPreview = async (file) => {
    let src = file.url;
    if (!src && file.originFileObj) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const props = {
    name: "file",
    multiple: true,
    fileList,
    maxCount: 9,
    beforeUpload: () => false,
    onChange(info) {
      setFileList(info.fileList ?? []);
    },
    onPreview,
    showUploadList: false, // ẩn list mặc định để custom
  };

  return (
    <div style={{ width: "100%" }}>
      {/* Title */}
      <h3 style={{ marginBottom: 4 }}>Quản lý ảnh phòng</h3>
      <p style={{ fontSize: 13, marginBottom: 18 }}>
        Tải lên tối đa <b>9 ảnh</b> để khách hàng có thể xem chi tiết phòng
      </p>

      {/* Label */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontWeight: 500,
          marginBottom: 12,
        }}
      >
        <ProfileOutlined style={{ fontSize: 16 }} />
        <span>Ảnh phòng</span>
        <span style={{ color: "#000000ff" }}>{fileList.length}/9 ảnh</span>
      </div>

      {/* Upload nút giữ nguyên */}
      <Upload {...props}>
        <Button icon={<UploadOutlined />}>Thêm ảnh</Button>
      </Upload>

      {/* Hiển thị ảnh upload theo 3 cột */}
      {fileList.length > 0 && (
        <Row gutter={[8, 8]} style={{ marginTop: 16 }}>
          {fileList.map((file) => (
            <Col key={file.uid} span={8}>
              <Card
                hoverable
                style={{ position: "relative", cursor: "pointer" }}
                onClick={() => onPreview(file)}
              >
                <Image
                  src={file.url || URL.createObjectURL(file.originFileObj)}
                  alt="room"
                  style={{ width: "100%", height: 100, objectFit: "cover" }}
                  preview={false} // tắt preview mặc định
                />
                <Button
                  type="text"
                  icon={<CloseOutlined />}
                  danger
                  size="small"
                  style={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                  }}
                  onClick={(e) => {
                    setFileList(fileList.filter((f) => f.uid !== file.uid));

                    e.stopPropagation();
                    onRemove(file);
                  }}
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Khung preview khi chưa có ảnh */}
      {fileList.length === 0 && (
        <div
          style={{
            border: "1px dashed #d9d9d9",
            borderRadius: 8,
            marginTop: 16,
            padding: 32,
            textAlign: "center",
            minHeight: 200,
          }}
        >
          <span style={{ fontSize: 40, color: "#999" }}>
            <PiImage />
          </span>
          <p style={{ marginTop: 12, marginBottom: 0, color: "#666" }}>
            Chưa có ảnh phòng nào
          </p>
          <p style={{ color: "#999", fontSize: 13 }}>
            Click “Thêm ảnh” để upload ảnh minh hoạ phòng
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
