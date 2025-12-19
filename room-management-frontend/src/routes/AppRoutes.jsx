import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { path_name } from "../constants/path_name";

// import các page
import DashboardPage from "../pages/dashboard/DashboardPage";
import BuildingPage from "../pages/building/BuildingPage";
import UserPage from "../pages/user/UserPage";
import RoomPage from "../pages/rooms/RoomPage";
import RoomDetailPage from "../pages/rooms/RoomDetailPage"; // chi tiết phòng
import TenantPage from "../pages/tenant/TenantPage";
import ContractPage from "../pages/contract/ContractPage";
import InvoicePage from "../pages/invoice/InvoicePage";
import InvoiceForm from "../pages/invoice/InvoiceForm";
import PaymentPage from "../pages/payment/PaymentPage";
import IssuePage from "../pages/issue/IssuePage";
import NotificationPage from "../pages/notificaation/NotificationPage";
import MeterReadingPage from "../pages/meter/MeterPage";
import Login from "../pages/auth/Login";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Các route chính nằm trong layout */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to={path_name.dashboard} replace />} />
        <Route path={path_name.dashboard} element={<DashboardPage />} />
        <Route path={path_name.user} element={<UserPage />} />
        <Route path={path_name.building} element={<BuildingPage />} />
        <Route path={path_name.room} element={<RoomPage />} />
        <Route path={path_name.tenant} element={<TenantPage />} />
        <Route path={path_name.contract} element={<ContractPage />} />
        <Route path={path_name.invoice} element={<InvoicePage />} />
        <Route
          path={path_name.invoice + "/them-moi"}
          element={<InvoiceForm />}
        />
        <Route
          path={path_name.invoice + "/:invoiceId"}
          element={<InvoiceForm />}
        />
        <Route path={path_name.meter} element={<MeterReadingPage />} />
        <Route path={path_name.payment} element={<PaymentPage />} />
        <Route path={path_name.issue} element={<IssuePage />} />
        <Route path={path_name.notification} element={<NotificationPage />} />
        <Route path={path_name.login} element={<Login />} />
      </Route>

      {/* Route chi tiết phòng nằm ngoài layout */}
      <Route path="/xem-phong" element={<RoomDetailPage />} />

      {/* Route fallback */}
      <Route path="*" element={<Navigate to={path_name.dashboard} replace />} />
    </Routes>
  );
};
