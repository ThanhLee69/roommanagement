// import React, { createContext, useContext, useMemo } from "react";
// import { useAuth } from "./AuthContext";

// /**
//  * Định nghĩa PERMISSION CODE
//  * 👉 NÊN map giống backend (Spring Security)
//  */
// export const PERMISSIONS = {
//   // Building
//   BUILDING_VIEW: "BUILDING_VIEW",
//   BUILDING_CREATE: "BUILDING_CREATE",
//   BUILDING_UPDATE: "BUILDING_UPDATE",
//   BUILDING_DELETE: "BUILDING_DELETE",

//   // Room
//   ROOM_VIEW: "ROOM_VIEW",
//   ROOM_CREATE: "ROOM_CREATE",
//   ROOM_UPDATE: "ROOM_UPDATE",
//   ROOM_DELETE: "ROOM_DELETE",

//   // Tenant
//   TENANT_VIEW: "TENANT_VIEW",
//   TENANT_CREATE: "TENANT_UPDATE",

//   // Contract
//   CONTRACT_VIEW: "CONTRACT_VIEW",
//   CONTRACT_CREATE: "CONTRACT_CREATE",

//   // Invoice
//   INVOICE_VIEW: "INVOICE_VIEW",
//   INVOICE_CREATE: "INVOICE_CREATE",
//   INVOICE_PAY: "INVOICE_PAY",

//   // User
//   USER_MANAGE: "USER_MANAGE",
// };

// /**
//  * Mapping ROLE → PERMISSIONS
//  * ⚠️ Có thể thay bằng permissions trả về từ JWT / API
//  */
// const ROLE_PERMISSIONS = {
//   ADMIN: Object.values(PERMISSIONS), // ADMIN có tất cả quyền

//   STAFF: [
//     PERMISSIONS.BUILDING_VIEW,
//     PERMISSIONS.ROOM_VIEW,
//     PERMISSIONS.TENANT_VIEW,
//     PERMISSIONS.CONTRACT_VIEW,
//     PERMISSIONS.CONTRACT_CREATE,
//     PERMISSIONS.INVOICE_VIEW,
//     PERMISSIONS.INVOICE_CREATE,
//     PERMISSIONS.INVOICE_PAY,
//   ],
// };

// const PermissionContext = createContext(null);

// export const PermissionProvider = ({ children }) => {
//   const { user } = useAuth();

//   const permissions = useMemo(() => {
//     if (!user?.role) return [];
//     return ROLE_PERMISSIONS[user.role] || [];
//   }, [user]);

//   /**
//    * Kiểm tra có quyền hay không
//    */
//   const hasPermission = (permissionCode) => {
//     return permissions.includes(permissionCode);
//   };

//   /**
//    * Kiểm tra có ít nhất 1 quyền trong danh sách
//    */
//   const hasAnyPermission = (permissionCodes = []) => {
//     return permissionCodes.some((p) => permissions.includes(p));
//   };

//   /**
//    * Kiểm tra có đủ tất cả quyền
//    */
//   const hasAllPermissions = (permissionCodes = []) => {
//     return permissionCodes.every((p) => permissions.includes(p));
//   };

//   return (
//     <PermissionContext.Provider
//       value={{
//         permissions,
//         hasPermission,
//         hasAnyPermission,
//         hasAllPermissions,
//       }}
//     >
//       {children}
//     </PermissionContext.Provider>
//   );
// };

// export const usePermission = () => {
//   const context = useContext(PermissionContext);
//   if (!context) {
//     throw new Error("usePermission must be used inside PermissionProvider");
//   }
//   return context;
// };
