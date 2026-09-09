package com.giftabled.attendance.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendance")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long candidateId;

    private Long sessionId;

    private LocalDate date;

    private LocalDateTime checkInTime;

    @Enumerated(EnumType.STRING)
    private Status status;

    @Enumerated(EnumType.STRING)
    private Method method;

    private Double latitude;

    private Double longitude;

    public enum Status {
        PRESENT,
        ABSENT
    }

    public enum Method {
        QR,
        GEO,
        OVERRIDE
    }
}