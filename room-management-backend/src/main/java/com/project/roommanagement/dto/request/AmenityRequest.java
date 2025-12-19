package com.project.roommanagement.dto.request;

import com.project.roommanagement.enums.AmenityScope;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class AmenityRequest {

//    @NotBlank(message = "Amenity name must not be blank")
//    @Size(max = 100, message = "Amenity name must not exceed 100 characters")
    private String name;

//    @Size(max = 255, message = "Description must not exceed 255 characters")
    private String description;

//    @NotNull(message = "Scope must not be null")
    private AmenityScope scope;

}
