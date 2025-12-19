//package com.project.roommanagement.mapper;
//
//import com.project.roommanagement.dto.request.RoleRequest;
//import com.project.roommanagement.dto.response.RoleResponse;
//import com.project.roommanagement.entity.Role;
//import org.mapstruct.Mapper;
//import org.mapstruct.Mapping;
//
//@Mapper(componentModel = "spring")
//public interface RoleMapper {
//
//    @Mapping(target = "permissions", ignore = true)
//    Role toRole(RoleRequest request);
//
//    RoleResponse toRoleResponse(Role role);
//}
