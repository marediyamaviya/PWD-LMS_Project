package com.pwd.assessment_service.dto;

import java.util.List;

public record SubmitAttemptRequest(
        String candidateId,
        List<AnswerSubmission> answers) {
}
