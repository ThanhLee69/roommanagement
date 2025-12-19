package com.project.roommanagement.dto.response;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomImageResponse {

    private Long id;
    private String imageUrl;
}
