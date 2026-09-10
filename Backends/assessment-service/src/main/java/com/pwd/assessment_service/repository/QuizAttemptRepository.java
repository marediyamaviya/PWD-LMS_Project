package com.pwd.assessment_service.repository;

import com.pwd.assessment_service.entity.QuizAttempt;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    long countByQuizIdAndCandidateId(Long quizId, String candidateId);

    List<QuizAttempt> findByQuizIdOrderBySubmittedAtDesc(Long quizId);

    List<QuizAttempt> findByQuizIdAndCandidateIdOrderBySubmittedAtDesc(Long quizId, String candidateId);
}
