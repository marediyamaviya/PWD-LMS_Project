package com.pwd.assessment_service.dto;

public record QuizRequest(String title,
                          String description,
                          Long courseId) {
    public QuizRequest(String title, String description) {
        this(title, description, null);
    }
}
