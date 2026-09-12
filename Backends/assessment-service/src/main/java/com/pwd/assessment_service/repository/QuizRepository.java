package com.pwd.assessment_service.repository;

import com.pwd.assessment_service.entity.Quiz;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
    List<Quiz> findByCourseIdOrderById(Long courseId);

    Optional<Quiz> findByIdAndCourseId(Long id, Long courseId);

    List<Quiz> findByTitleContainingIgnoreCaseOrderById(String title);

}
