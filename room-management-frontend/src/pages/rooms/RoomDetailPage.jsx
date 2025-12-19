import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Row, Col, Card, Image, Button, Tag, message } from "antd";
import { ArrowLeftOutlined, PhoneOutlined } from "@ant-design/icons";
import { getRoomByName } from "../../api/roomApi";
import MyCard from "../../components/MyCard";
import { formatCurrency } from "../../utils/format-currency";
import { AiFillStar } from "react-icons/ai";
import { ROOM_STATUS_OPTIONS, ROOM_TYPE_OPTIONS } from "../../constants/labels";

const RoomDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const roomCode = searchParams.get("phong");

  const [room, setRoom] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    if (!roomCode) {
      message.error("Không tìm thấy mã phòng");
      return;
    }
    const fetchRoom = async () => {
      try {
        const res = await getRoomByName(roomCode); // API trả về room object
        setRoom(res);
        if (res.images && res.images.length > 0) {
          // nếu API trả về object { id, imageUrl }
          const firstImageUrl = res.images[0].imageUrl ?? res.images[0];
          setSelectedImage(firstImageUrl);
        }
      } catch (err) {
        message.error("Lấy thông tin phòng thất bại");
      }
    };
    fetchRoom();
  }, [roomCode]);

  if (!room) return null;

  return (
    <div style={{ padding: 24, maxWidth: 1300, margin: "0 auto" }}>
      <Button
        type="default"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: 16 }}
      >
        Quay lại danh sách
      </Button>

      <h2 style={{ fontWeight: 700, color: "#536ee7ff" }}>Phòng {room.name}</h2>

      <Row gutter={24} style={{ marginTop: 20 }}>
        {/* Ảnh phòng */}
        <Col span={16}>
          <MyCard
            title="Hình ảnh phòng"
            style={{ marginBottom: 30, background: "#fff" }}
          >
            {selectedImage && (
              <Image
                src={selectedImage}
                width="100%"
                height={500}
                style={{ objectFit: "cover", borderRadius: 6 }}
                preview={false}
              />
            )}

            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              {room.images?.map((img) => {
                const url = img.imageUrl ?? img; // object hoặc chuỗi
                return (
                  <Image
                    key={img.id ?? url}
                    src={url}
                    width={80}
                    height={80}
                    style={{
                      objectFit: "cover",
                      border:
                        url === selectedImage
                          ? "2px solid #1890ff"
                          : "1px solid #ccc",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                    onClick={() => setSelectedImage(url)}
                    preview={false}
                  />
                );
              })}
            </div>
          </MyCard>

          <MyCard title="Mô tả">
            <span>{room.description || "Chưa có mô tả"}</span>
          </MyCard>
        </Col>

        {/* Thông tin phòng */}
        <Col span={8}>
          <MyCard title="Thông tin phòng" style={{ marginBottom: 30 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <label>Mã phòng:</label>
                <span>{room.name}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <label>Tòa nhà:</label>
                <span>{room.buildingName}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <label>Loại phòng:</label>
                <span>
                  {ROOM_TYPE_OPTIONS.find((opt) => opt.value === room.roomType)
                    ?.label || room.roomType}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <label>Tầng:</label>
                <span>{room.floor}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <label>Diện tích:</label>
                <span>{room.area} m²</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <label>Số người tối đa:</label>
                <span>{room.maxOccupancy} người</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <label>Trạng thái:</label>
                <Tag
                  color={
                    room.status === "AVAILABLE"
                      ? "green"
                      : room.status === "OCCUPIED"
                        ? "red"
                        : room.status === "MAINTENANCE"
                          ? "orange"
                          : room.status === "RESERVED"
                            ? "blue"
                            : "gray"
                  }
                >
                  {ROOM_STATUS_OPTIONS.find((opt) => opt.value === room.status)
                    ?.label || room.status}
                </Tag>
              </div>
            </div>
          </MyCard>

          <MyCard title="Giá thuê" style={{ marginBottom: 30 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <label>Giá thuê:</label>
                <strong>
                  {formatCurrency(room.rentalPrice, true)} / tháng
                </strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <label>Tiền cọc:</label>
                <span>{formatCurrency(room.rentalPrice, true)}</span>
              </div>
            </div>
          </MyCard>

          <MyCard title="Tiện nghi" style={{ marginBottom: 30 }}>
            <ul
              style={{
                paddingLeft: 0,
                margin: 0,
                listStyle: "none",
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "8px 16px",
              }}
            >
              {room.amenityNames?.map((amenity, idx) => (
                <li
                  key={idx}
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  <AiFillStar color="#443bf0ff" />
                  <span>{amenity}</span>
                </li>
              ))}
            </ul>
          </MyCard>

          {room.status === "AVAILABLE" && (
            <MyCard title="Liên hệ thuê phòng">
              <p>
                Phòng này hiện đang trống và có thể cho thuê. Vui lòng liên hệ
                để biết thêm thông tin.
              </p>

              <Button
                style={{ background: "black" }}
                type="primary"
                icon={<PhoneOutlined />}
                block
              >
                Liên hệ ngay
              </Button>
            </MyCard>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default RoomDetailPage;
