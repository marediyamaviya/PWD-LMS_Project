package com.giftabled.course_service.service;

import com.giftabled.course_service.entity.Enrollment;
import com.giftabled.course_service.entity.EnrollmentStatus;
import com.giftabled.course_service.entity.ModuleProgress;
import com.giftabled.course_service.repository.EnrollmentRepository;
import com.giftabled.course_service.repository.ModuleProgressRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProgressService {

    private final ModuleProgressRepository progressRepository;
    private final EnrollmentRepository enrollmentRepository;

    public ProgressService(
            ModuleProgressRepository progressRepository,
            EnrollmentRepository enrollmentRepository
    ) {
        this.progressRepository = progressRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    public ModuleProgress updateProgress(
            Long courseId,
            Long moduleId,
            Long candidateId,
            Integer progressPercent
    ) {

        if (progressPercent < 0 || progressPercent > 100) {
            throw new RuntimeException(
                    "Progress must be between 0 and 100"
            );
        }

        Enrollment enrollment =
                enrollmentRepository
                        .findByCourseIdAndCandidateId(
                                courseId,
                                candidateId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Candidate is not enrolled in this course"
                                )
                        );

        ModuleProgress progress =
                progressRepository
                        .findByModuleIdAndCandidateId(
                                moduleId,
                                candidateId
                        )
                        .orElseGet(ModuleProgress::new);

        progress.setCourseId(courseId);
        progress.setModuleId(moduleId);
        progress.setCandidateId(candidateId);
        progress.setProgressPercent(progressPercent);

        ModuleProgress saved =
                progressRepository.save(progress);

        updateCourseProgress(courseId, candidateId, enrollment);

        return saved;
    }

    private void updateCourseProgress(
            Long courseId,
            Long candidateId,
            Enrollment enrollment
    ) {

        List<ModuleProgress> progressList =
                progressRepository
                        .findByCourseIdAndCandidateId(
                                courseId,
                                candidateId
                        );

        if (progressList.isEmpty()) {
            return;
        }

        int total = 0;

        for (ModuleProgress progress : progressList) {
            total += progress.getProgressPercent();
        }

        int courseProgress =
                total / progressList.size();

        enrollment.setProgressPercent(courseProgress);

        if (courseProgress == 100) {
            enrollment.setStatus(
                    EnrollmentStatus.COMPLETED
            );
        } else {
            enrollment.setStatus(
                    EnrollmentStatus.ENROLLED
            );
        }

        enrollmentRepository.save(enrollment);
    }
}