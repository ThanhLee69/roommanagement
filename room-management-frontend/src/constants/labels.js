// constants/labels.js

// Giới tính
export const GENDER_OPTIONS = [
  { value: "MALE", label: "Nam" },
  { value: "FEMALE", label: "Nữ" },
  { value: "OTHER", label: "Khác" },
];

// Trạng thái khách thuê
export const TENANT_STATUS_OPTIONS = [
  { value: "RENTING", label: "Đang thuê" },
  { value: "CHECKED_OUT", label: "Đã trả phòng" },
  { value: "NOT_RENTED", label: "Chưa thuê" },
];
// Trạng thái hóa đơn
export const INVOICE_STATUS_OPTIONS = [
  { value: "UNPAID", label: "Chưa thanh toán" },
  { value: "PARTIALLY_PAID", label: "Thanh toán một phần" },
  { value: "PAID", label: "Đã thanh toán" },
  { value: "OVERDUE", label: "Quá hạn" },
  { value: "CANCELLED", label: "Đã hủy" },
];
//Phương thức thanh toán
export const PAYMENT_METHOD_OPTIONS = [
  { value: "CASH", label: "💵 Tiền mặt" },
  { value: "BANK_TRANSFER", label: "🏦 Chuyển khoản" },
  { value: "MOMO", label: "📱 MoMo" },
  { value: "ZALOPAY", label: "💳 ZaloPay" },
  { value: "VNPAY", label: "🧾 VNPay" },
];

// Trạng thái phòng
export const ROOM_STATUS_OPTIONS = [
  { value: "AVAILABLE", label: "Đang trống" },
  { value: "OCCUPIED", label: "Đang có người thuê" },
  { value: "MAINTENANCE", label: "Bảo trì" },
  { value: "RESERVED", label: "Đã đặt trước" },
  { value: "CLOSED", label: "Ngừng hoạt động" },
];
// Trạng thái hợp đồng
export const CONTRACT_STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Đang hiệu lực" },
  { value: "EXPIRED", label: "Hết hạn" },
  { value: "CANCELLED", label: "Hủy" },
];
// Chu kỳ thanh toán
export const PAYMENT_CYCLE_OPTIONS = [
  { value: "MONTHLY", label: "Thanh toán hàng tháng" },
  { value: "QUARTERLY", label: "Thanh toán theo quý" },
  { value: "YEARLY", label: "Thanh toán theo năm" },
];
// Loại phòng
export const ROOM_TYPE_OPTIONS = [
  { value: "STANDARD", label: "Tiêu chuẩn" },
  { value: "DELUXE", label: "Cao cấp" },
  { value: "STUDIO", label: "Studio" },
  { value: "APARTMENT", label: "Căn hộ" },
];

export  const ROLE_OPTIONS = [
    { value: "ADMIN", label: "Quản trị" },
    { value: "STAFF", label: "Nhân viên" },
    { value: "USER", label: "Người dùng" },
  ];

export const STATUS_OPTIONS = [
    { value: "ACTIVE", label: "Hoạt động" },
    { value: "INACTIVE", label: "Ngưng hoạt động" },
  ];
