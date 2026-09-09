package com.giftabled.attendance.dto;

import lombok.Data;

@Data
public class QRCheckInRequest {

    private Long sessionId;
    private String qrToken;
}