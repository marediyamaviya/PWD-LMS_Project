package com.giftabled.course_service.service;

import com.giftabled.course_service.entity.Course;
import com.giftabled.course_service.entity.Enrollment;
import com.giftabled.course_service.entity.EnrollmentStatus;
import com.giftabled.course_service.repository.CourseRepository;
import com.giftabled.course_service.repository.EnrollmentRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;

    public EnrollmentService(
            EnrollmentRepository enrollmentRepository,
            CourseRepository courseRepository
    ) {
        this.enrollmentRepository = enrollmentRepository;
        this.courseRepository = courseRepository;
    }

    public Enrollment enroll(
            Long courseId,
            Long candidateId
    ) {

        courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Course not found with id: " + courseId
                        )
                );

        if (enrollmentRepository
                .findByCourseIdAndCandidateId(
                        courseId,
                        candidateId
                ).isPresent()) {

            throw new RuntimeException(
                    "Candidate is already enrolled in this course"
            );
        }

        Enrollment enrollment = new Enrollment();

        enrollment.setCourseId(courseId);
        enrollment.setCandidateId(candidateId);
        enrollment.setProgressPercent(0);
        enrollment.setStatus(EnrollmentStatus.ENROLLED);
        enrollment.setEnrolledAt(LocalDateTime.now());

        return enrollmentRepository.save(enrollment);
    }

    public List<Enrollment> getCandidateEnrollments(
            Long candidateId
    ) {

        return enrollmentRepository
                .findByCandidateId(candidateId);
    }
}