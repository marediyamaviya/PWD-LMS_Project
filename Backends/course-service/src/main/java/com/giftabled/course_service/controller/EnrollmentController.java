package com.giftabled.course_service.controller;

import com.giftabled.course_service.entity.Enrollment;
import com.giftabled.course_service.service.EnrollmentService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/courses")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    public EnrollmentController(
            EnrollmentService enrollmentService
    ) {
        this.enrollmentService = enrollmentService;
    }

    @PostMapping("/{courseId}/enroll")
    public Enrollment enroll(
            @PathVariable Long courseId,
            @RequestParam Long candidateId
    ) {

        return enrollmentService.enroll(
                courseId,
                candidateId
        );
    }

    @GetMapping("/enrolled")
    public List<Enrollment> getEnrolledCourses(
            @RequestParam Long candidateId
    ) {

        return enrollmentService
                .getCandidateEnrollments(candidateId);
    }
}