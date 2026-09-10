package com.pwd.assessment_service.dto;

public record QuizSummaryResponse(Long id, String title, String description,
                                  Long courseId, int questionCount) {
}
