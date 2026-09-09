package com.giftabled.attendance.dto;

import lombok.Data;

@Data
public class GeoCheckInRequest {

    private Long sessionId;

    private Double latitude;

    private Double longitude;
}