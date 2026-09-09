package com.giftabled.attendance.service;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class QRService {

    private final Map<Long, String> qrTokens = new HashMap<>();

    public String generateQRToken(Long sessionId) {

        String token = UUID.randomUUID().toString();

        qrTokens.put(sessionId, token);

        System.out.println("Generated QR Token: " + token);

        return token;
    }

    public boolean validateQRToken(Long sessionId, String qrToken) {

        String storedToken = qrTokens.get(sessionId);

        System.out.println("Stored Token: " + storedToken);
        System.out.println("Received Token: " + qrToken);

        return storedToken != null && storedToken.equals(qrToken);
    }
}