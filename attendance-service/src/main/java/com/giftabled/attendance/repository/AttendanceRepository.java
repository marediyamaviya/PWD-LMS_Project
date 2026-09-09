package com.giftabled.attendance.repository;

import com.giftabled.attendance.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AttendanceRepository
        extends JpaRepository<Attendance, Long> {

    Optional<Attendance> findByCandidateIdAndSessionId(
            Long candidateId,
            Long sessionId
    );

    List<Attendance> findByCandidateId(Long candidateId);

    List<Attendance> findBySessionId(Long sessionId);
}