// import React, { Fragment, useEffect, useState } from "react";
// import {
//   Flex,
//   Space,
//   Table,
//   Tag,
//   Card,
//   Col,
//   Row,
//   Statistic,
//   Input,
//   Button,
//   Pagination,
// } from "antd";
// import {
//   ArrowDownOutlined,
//   ArrowUpOutlined,
//   PlusOutlined,
//   FormOutlined,
//   DeleteOutlined,
// } from "@ant-design/icons";
// import { getBuildings } from "../../api/buildingApi";
// import MyCard from "../../components/MyCard";
// import { useNotify } from "../../components/NotificationProvider";
// import BuildingForm from "./BuildingFrom";

// const BuildingPage = () => {
//   const { notify, contextHolder } = useNotify();
//   const [buildings, setBuildings] = useState({
//     items: [],
//     currentPage: 0,
//     totalItems: 0,
//     pageSize: 5,
//   });
//   const [loading, setLoading] = useState(false);
//   const [keyword, setKeyword] = useState("");
//   const [page, setPage] = useState(0);
//   const [pageSize, setPageSize] = useState(5);
//   const columns = [
//     { title: "Tên", dataIndex: "name", key: "name" },
//     { title: "Địa chỉ", dataIndex: "address", key: "address" },
//     { title: "Mô tả", dataIndex: "description", key: "description" },
//     { title: "Số tầng", dataIndex: "numberOfFloors", key: "numberOfFloors" },
//     { title: "Diện tích", dataIndex: "area", key: "area" },
//     {
//       title: "Tiện ích",
//       dataIndex: "amenityNames",
//       key: "amenityNames",
//       render: (amenities) => {
//         const visible = amenities.slice(0, 3);
//         const extra = amenities.length - visible.length;
//         return (
//           <>
//             {visible.map((amenity) => (
//               <Tag color="blue" key={amenity}>
//                 {amenity}
//               </Tag>
//             ))}
//             {extra > 0 && <Tag>+{extra}</Tag>}
//           </>
//         );
//       },
//     },
//     {
//       title: "Thao tác",
//       key: "action",
//       render: (_, record) => (
//         <Space size="middle">
//           <Button
//             type="text"
//             icon={<FormOutlined />}
//             onClick={() => showModal("edit", record)}
//           />
//           <Button type="text" icon={<DeleteOutlined />} danger />
//         </Space>
//       ),
//     },
//   ];
//   const fetchBuilding = async () => {
//     setLoading(true);
//     try {
//       const res = await getBuildings({ keyword, page, pageSize });
//       setBuildings(res);
//       setPage(res.currentPage);
//       setPageSize(res.pageSize);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBuilding(keyword, page, pageSize);
//   }, [keyword, page, pageSize]);

//   const onPageChange = (newPage) => {
//     setPage(newPage - 1);
//   };
//   const onPageSizeChange = (current, size) => {
//     setPageSize(size);
//     setPage(0);
//   };

//   const [open, setOpen] = useState({
//     isModal: false,
//     isMode: "",
//     record: null,
//   });

//   const showModal = (mode, record) => {
//     setOpen({
//       isModal: true,
//       isMode: mode,
//       record: record,
//     });
//   };

//   const hideModal = () => {
//     setOpen({ isModal: false });
//   };

//   return (
//     <Fragment>
//       {contextHolder}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           marginBottom: 20,
//         }}
//       >
//         <div>
//           <h1 style={{ marginBottom: 5, fontWeight: 700, color: "#536ee7ff" }}>
//             Quản lý tòa nhà
//           </h1>
//           <h4 style={{ color: "#536ee7ff" }}>
//             Danh sách tất cả các tòa nhà trong hệ thống
//           </h4>
//         </div>
//         <Button type="primary" onClick={() => showModal("add")}>
//           <PlusOutlined />
//           Thêm tòa nhà
//         </Button>
//       </div>
//       <Flex vertical gap={25}>
//         <MyCard title="Tìm kiếm và lọc">
//           <Input
//             placeholder="Tìm kiếm..."
//             allowClear
//             value={keyword}
//             onChange={(e) => {
//               setKeyword(e.target.value);
//             }}
//           />
//         </MyCard>
//         <Row gutter={{ xs: 16, sm: 24, md: 30 }}>
//           <Col xs={24} sm={12} md={8}>
//             <Card variant="borderless">
//               <Statistic
//                 title={
//                   <span>
//                     Tổng số phòng
//                     <ArrowUpOutlined
//                       style={{ marginLeft: 5, color: "#3f8600" }}
//                     />
//                   </span>
//                 }
//                 value={11}
//                 valueStyle={{ color: "#3f8600" }}
//               />
//             </Card>
//           </Col>
//           <Col xs={24} sm={12} md={8}>
//             <Card variant="borderless">
//               <Statistic
//                 title={
//                   <span>
//                     <ArrowDownOutlined /> Phòng trống
//                   </span>
//                 }
//                 value={9}
//                 valueStyle={{ color: "#cf1322" }}
//               />
//             </Card>
//           </Col>
//           <Col xs={24} sm={12} md={8}>
//             <Card variant="borderless">
//               <Statistic
//                 title={
//                   <span>
//                     Đang thuê
//                     <ArrowUpOutlined
//                       style={{ marginLeft: 5, color: "#3f8600" }}
//                     />
//                   </span>
//                 }
//                 value={7}
//                 valueStyle={{ color: "#3f8600" }}
//               />
//             </Card>
//           </Col>
//         </Row>
//         <MyCard title="Danh sách tòa nhà">
//           <Table
//             size="small"
//             columns={columns}
//             dataSource={buildings.items}
//             rowKey="id"
//             loading={loading}
//             pagination={false}
//           />
//           <Pagination
//             current={buildings.currentPage + 1}
//             pageSize={pageSize}
//             total={buildings.totalItems}
//             showSizeChanger
//             pageSizeOptions={["5", "10", "20", "50"]}
//             onChange={onPageChange}
//             onShowSizeChange={onPageSizeChange}
//             style={{
//               marginTop: 16,
//               display: "flex",
//               justifyContent: "flex-end",
//             }}
//           />
//         </MyCard>
//       </Flex>

//       {open.isModal && (
//         <BuildingForm
//           isMode={open.isMode}
//           record={open.record || {}}
//           hideModal={hideModal}
//           isModal={open.isModal}
//           fetchBuilding={fetchBuilding}
//           notify={notify}
//           setLoading={setLoading}
//         />
//       )}
//     </Fragment>
//   );
// };
// export default BuildingPage;
