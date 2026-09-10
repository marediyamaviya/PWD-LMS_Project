package com.pwd.assessment_service.dto;

import java.util.List;

public record QuizResponse(Long id, String title, String description, Long courseId,
                           List<QuestionResponse> questions) {
}
