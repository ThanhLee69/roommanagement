package com.project.roommanagement.enums;

public enum RoomStatus {
    AVAILABLE,   // Phòng đang trống, có thể thuê
    OCCUPIED,    // Phòng đang có người thuê
    MAINTENANCE, // Phòng đang bảo trì, không cho thuê
    RESERVED,    // Phòng đã được đặt trước nhưng chưa thuê
    CLOSED       // Phòng đóng, không sử dụng nữa
}