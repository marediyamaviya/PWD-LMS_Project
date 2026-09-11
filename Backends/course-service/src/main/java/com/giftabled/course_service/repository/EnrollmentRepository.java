package com.giftabled.course_service.repository;

import com.giftabled.course_service.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EnrollmentRepository
        extends JpaRepository<Enrollment, Long> {

    List<Enrollment> findByCandidateId(Long candidateId);

    Optional<Enrollment> findByCourseIdAndCandidateId(
            Long courseId,
            Long candidateId
    );
}