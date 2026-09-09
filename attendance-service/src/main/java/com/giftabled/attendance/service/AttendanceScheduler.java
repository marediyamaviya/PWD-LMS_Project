package com.giftabled.attendance.service;

import com.giftabled.attendance.entity.Attendance;
import com.giftabled.attendance.repository.AttendanceRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class AttendanceScheduler {

    private final AttendanceRepository attendanceRepository;

    public AttendanceScheduler(AttendanceRepository attendanceRepository) {
        this.attendanceRepository = attendanceRepository;
    }

    @Scheduled(fixedRate = 600000)
    public void markAbsentCandidates() {

        System.out.println("Attendance Scheduler is running...");

        // Temporary test data
        Long sessionId = 509L;

        List<Long> candidateIds = List.of(
                101L,
                102L,
                103L,
                104L
        );

        for (Long candidateId : candidateIds) {

            boolean alreadyMarked =
                    attendanceRepository
                            .findByCandidateIdAndSessionId(
                                    candidateId,
                                    sessionId
                            )
                            .isPresent();

            if (!alreadyMarked) {

                Attendance attendance = new Attendance();

                attendance.setCandidateId(candidateId);
                attendance.setSessionId(sessionId);
                attendance.setDate(LocalDate.now());
                attendance.setCheckInTime(LocalDateTime.now());
                attendance.setStatus(Attendance.Status.ABSENT);
                attendance.setMethod(Attendance.Method.OVERRIDE);

                attendanceRepository.save(attendance);

                System.out.println(
                        "Candidate " + candidateId +
                                " marked ABSENT for session " + sessionId
                );
            }
        }
    }
}