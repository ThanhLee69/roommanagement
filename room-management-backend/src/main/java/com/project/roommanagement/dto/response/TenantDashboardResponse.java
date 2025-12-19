package com.project.roommanagement.dto.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TenantDashboardResponse {
    private long totalTenants;
    private long rentingTenants;
    private long checkedOutTenants;
    private long notRentedTenants;
}
