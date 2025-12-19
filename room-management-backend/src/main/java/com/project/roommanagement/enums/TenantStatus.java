package com.project.roommanagement.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
public enum TenantStatus {
    RENTING,        //Đang thuê
    CHECKED_OUT,    //Đã trả phòng
    NOT_RENTED,     //Chưa thuê
}
