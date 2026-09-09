package com.giftabled.attendance.service;

import com.giftabled.attendance.dto.GeoCheckInRequest;
import com.giftabled.attendance.dto.QRCheckInRequest;
import com.giftabled.attendance.entity.Attendance;
import com.giftabled.attendance.repository.AttendanceRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final QRService qrService;

    public AttendanceService(AttendanceRepository attendanceRepository,
                             QRService qrService) {
        this.attendanceRepository = attendanceRepository;
        this.qrService = qrService;
    }

    public Attendance markAttendance(Attendance attendance) {

        if (attendanceRepository
                .findByCandidateIdAndSessionId(
                        attendance.getCandidateId(),
                        attendance.getSessionId())
                .isPresent()) {

            throw new RuntimeException(
                    "Attendance already marked for this session"
            );
        }

        return attendanceRepository.save(attendance);
    }

    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }

    public Attendance getAttendanceById(Long id) {

        return attendanceRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Attendance not found"));
    }

    public Attendance markQRCheckIn(QRCheckInRequest request) {

        Long candidateId = 101L;
        Long sessionId = request.getSessionId();

        if (!qrService.validateQRToken(
                sessionId,
                request.getQrToken())) {

            throw new RuntimeException("Invalid QR token");
        }

        if (attendanceRepository
                .findByCandidateIdAndSessionId(
                        candidateId,
                        sessionId)
                .isPresent()) {

            throw new RuntimeException(
                    "Attendance already marked for this session"
            );
        }

        Attendance attendance = new Attendance();

        attendance.setCandidateId(candidateId);
        attendance.setSessionId(sessionId);
        attendance.setDate(LocalDate.now());
        attendance.setCheckInTime(LocalDateTime.now());
        attendance.setStatus(Attendance.Status.PRESENT);
        attendance.setMethod(Attendance.Method.QR);

        return attendanceRepository.save(attendance);
    }

    public Attendance markGeoCheckIn(GeoCheckInRequest request) {

        Long candidateId = 101L;
        Long sessionId = request.getSessionId();

        double sessionLatitude = 15.1234;
        double sessionLongitude = 75.5678;
        double allowedRadius = 100.0;

        double distance = calculateDistance(
                request.getLatitude(),
                request.getLongitude(),
                sessionLatitude,
                sessionLongitude
        );

        if (distance > allowedRadius) {

            throw new RuntimeException(
                    "You are outside the allowed location"
            );
        }

        if (attendanceRepository
                .findByCandidateIdAndSessionId(
                        candidateId,
                        sessionId)
                .isPresent()) {

            throw new RuntimeException(
                    "Attendance already marked for this session"
            );
        }

        Attendance attendance = new Attendance();

        attendance.setCandidateId(candidateId);
        attendance.setSessionId(sessionId);
        attendance.setDate(LocalDate.now());
        attendance.setCheckInTime(LocalDateTime.now());
        attendance.setStatus(Attendance.Status.PRESENT);
        attendance.setMethod(Attendance.Method.GEO);
        attendance.setLatitude(request.getLatitude());
        attendance.setLongitude(request.getLongitude());

        return attendanceRepository.save(attendance);
    }

    public Attendance overrideAttendance(
            Long attendanceId,
            Attendance.Status newStatus) {

        Attendance attendance =
                attendanceRepository.findById(attendanceId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Attendance not found"
                                ));

        attendance.setStatus(newStatus);
        attendance.setMethod(Attendance.Method.OVERRIDE);

        return attendanceRepository.save(attendance);
    }

    public List<Attendance> getCandidateAttendance(Long candidateId) {

        return attendanceRepository.findByCandidateId(candidateId);
    }

    public List<Attendance> getSessionAttendance(Long sessionId) {

        return attendanceRepository.findBySessionId(sessionId);
    }

    private double calculateDistance(
            double latitude1,
            double longitude1,
            double latitude2,
            double longitude2) {

        final int EARTH_RADIUS = 6371000;

        double latDistance =
                Math.toRadians(latitude2 - latitude1);

        double lonDistance =
                Math.toRadians(longitude2 - longitude1);

        double a =
                Math.sin(latDistance / 2)
                        * Math.sin(latDistance / 2)
                        + Math.cos(Math.toRadians(latitude1))
                        * Math.cos(Math.toRadians(latitude2))
                        * Math.sin(lonDistance / 2)
                        * Math.sin(lonDistance / 2);

        double c =
                2 * Math.atan2(
                        Math.sqrt(a),
                        Math.sqrt(1 - a)
                );

        return EARTH_RADIUS * c;
    }
}