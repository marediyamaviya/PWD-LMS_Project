package com.giftabled.attendance.controller;

import com.giftabled.attendance.dto.GeoCheckInRequest;
import com.giftabled.attendance.dto.QRCheckInRequest;
import com.giftabled.attendance.entity.Attendance;
import com.giftabled.attendance.service.AttendanceService;
import com.giftabled.attendance.service.QRService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;
    private final QRService qrService;

    public AttendanceController(
            AttendanceService attendanceService,
            QRService qrService) {

        this.attendanceService = attendanceService;
        this.qrService = qrService;
    }

    @PostMapping
    public ResponseEntity<Attendance> markAttendance(
            @RequestBody Attendance attendance) {

        Attendance savedAttendance =
                attendanceService.markAttendance(attendance);

        return new ResponseEntity<>(
                savedAttendance,
                HttpStatus.CREATED
        );
    }

    @GetMapping
    public ResponseEntity<List<Attendance>> getAllAttendance() {

        return ResponseEntity.ok(
                attendanceService.getAllAttendance()
        );
    }

    @GetMapping("/candidate/{candidateId}")
    public ResponseEntity<List<Attendance>>
    getCandidateAttendance(
            @PathVariable Long candidateId) {

        return ResponseEntity.ok(
                attendanceService
                        .getCandidateAttendance(candidateId)
        );
    }

    @GetMapping("/session/{sessionId}")
    public ResponseEntity<List<Attendance>>
    getSessionAttendance(
            @PathVariable Long sessionId) {

        return ResponseEntity.ok(
                attendanceService
                        .getSessionAttendance(sessionId)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Attendance>
    getAttendanceById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                attendanceService
                        .getAttendanceById(id)
        );
    }

    @PostMapping("/qr/generate")
    public ResponseEntity<String> generateQR(
            @RequestParam Long sessionId) {

        String token =
                qrService.generateQRToken(sessionId);

        return ResponseEntity.ok(token);
    }

    @PostMapping("/qr/check-in")
    public ResponseEntity<Attendance> qrCheckIn(
            @RequestBody QRCheckInRequest request) {

        Attendance attendance =
                attendanceService.markQRCheckIn(request);

        return new ResponseEntity<>(
                attendance,
                HttpStatus.CREATED
        );
    }

    @PostMapping("/geo/check-in")
    public ResponseEntity<Attendance> geoCheckIn(
            @RequestBody GeoCheckInRequest request) {

        Attendance attendance =
                attendanceService.markGeoCheckIn(request);

        return new ResponseEntity<>(
                attendance,
                HttpStatus.CREATED
        );
    }

    @PutMapping("/{id}/override")
    public ResponseEntity<Attendance>
    overrideAttendance(
            @PathVariable Long id,
            @RequestParam Attendance.Status status) {

        Attendance attendance =
                attendanceService.overrideAttendance(
                        id,
                        status
                );

        return ResponseEntity.ok(attendance);
    }
}