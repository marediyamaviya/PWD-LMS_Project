package com.pwd.assessment_service.dto;

import java.util.List;

public record QuestionRequest(
        String text,
        Integer points,
        List<OptionRequest> options) {
}
