package com.pwd.assessment_service.repository;

import com.pwd.assessment_service.entity.Question;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    Optional<Question> findByIdAndQuizId(Long id, Long quizId);
}
