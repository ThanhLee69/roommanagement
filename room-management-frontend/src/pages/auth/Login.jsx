import React from "react";
import {
  Form,
  Input,
  Button,
  Checkbox,
  Typography,
  Card,
  Row,
  Col,
} from "antd";
import loginBg from "../../assets/images/login.jpg";

const { Title, Text } = Typography;

export default function LoginPage() {
  const onFinish = (values) => {
    console.log("Login values:", values);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f0f2f5",
      }}
    >
      <Card
        style={{
          width: 900,
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 30px 60px rgba(0,0,0,0.2)",
        }}
      >
        <Row style={{ minHeight: 520 }}>
          {/* IMAGE LEFT (SAME RECTANGLE) */}
          <Col
            span={12}
            style={{
              backgroundImage: `url(${loginBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
              borderRadius: 20,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 20,
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.75))",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 40,
                left: 40,
                right: 40,
                color: "#fff",
              }}
            >
              <Title level={4} style={{ color: "#fff" }}>
                Chào mừng quay lại
              </Title>
              <Text style={{ color: "#ddd" }}>
                Hệ thống quản lý phòng trọ an toàn và tiện lợi
              </Text>
            </div>
          </Col>

          <Col
            span={12}
            style={{
              padding: "48px 40px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <Title level={3}>Đăng nhập</Title>
              <Text type="secondary">Vui lòng đăng nhập để tiếp tục </Text>
            </div>

            <Form
              layout="vertical"
              style={{ marginTop: 32 }}
              onFinish={onFinish}
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: "Vui lòng nhập email" }]}
              >
                <Input size="large" placeholder="example@email.com" />
              </Form.Item>

              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
              >
                <Input.Password size="large" placeholder="••••••••" />
              </Form.Item>

              <Row
                justify="space-between"
                align="middle"
                style={{ marginBottom: 24 }}
              >
                <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                <a href="#">Quên mật khẩu?</a>
              </Row>

              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                style={{
                  borderRadius: 8,
                  marginBottom: 12,
                  background: "black",
                }}
              >
                Đăng nhập
              </Button>

              <Button
                size="large"
                block
                style={{
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
                onClick={() => {
                  window.location.href =
                    "http://localhost:8080/oauth2/authorization/google";
                }}
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="google"
                  width={20}
                />
                Đăng nhập với Google
              </Button>
            </Form>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
