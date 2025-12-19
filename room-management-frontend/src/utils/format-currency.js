/**
 * Hiển thị tiền dạng VNĐ (có hoặc không có ₫)
 */
export const formatCurrency = (amount, withSymbol = false) => {
  if (amount === null || amount === undefined || amount === "") return "";

  if (withSymbol) {
    return Number(amount).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  }

  return Number(amount).toLocaleString("vi-VN");
};

