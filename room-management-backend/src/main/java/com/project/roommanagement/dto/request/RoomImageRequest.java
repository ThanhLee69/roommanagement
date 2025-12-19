package com.project.roommanagement.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomImageRequest {
    private Long roomId;
    private String imageUrl;
    private Boolean isMain;
}
