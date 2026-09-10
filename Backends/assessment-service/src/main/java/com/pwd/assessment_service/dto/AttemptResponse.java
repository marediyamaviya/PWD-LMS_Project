package com.pwd.assessment_service.dto;

import java.time.Instant;
public record AttemptResponse(Long id, Long quizId, String candidateId, int score,
                              int totalPoints, Instant submittedAt) {
}
