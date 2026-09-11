package com.giftabled.course_service.repository;

import com.giftabled.course_service.entity.ModuleProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ModuleProgressRepository
        extends JpaRepository<ModuleProgress, Long> {

    Optional<ModuleProgress> findByModuleIdAndCandidateId(
            Long moduleId,
            Long candidateId
    );

    List<ModuleProgress> findByCourseIdAndCandidateId(
            Long courseId,
            Long candidateId
    );
}