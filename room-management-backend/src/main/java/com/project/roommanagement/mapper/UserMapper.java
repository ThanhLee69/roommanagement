package com.project.roommanagement.mapper;

import com.project.roommanagement.dto.request.UserCreateRequest;
import com.project.roommanagement.dto.request.UserUpdateRequest;
import com.project.roommanagement.dto.response.UserResponse;
import com.project.roommanagement.entity.User;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface UserMapper {


    @Mapping(target = "status", ignore = true)
    @Mapping(target = "lastLogin", ignore = true)
    User toUser(UserCreateRequest request);


    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "username", ignore = true)
    @Mapping(target = "password", ignore = true)
    void updateUserFromRequest(UserUpdateRequest request, @MappingTarget User user);


    UserResponse toUserResponse(User user);
}
