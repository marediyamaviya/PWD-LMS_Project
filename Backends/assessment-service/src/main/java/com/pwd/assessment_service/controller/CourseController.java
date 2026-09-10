package com.pwd.assessment_service.controller;

import com.pwd.assessment_service.dto.QuizRequest;
import com.pwd.assessment_service.dto.QuizResponse;
import com.pwd.assessment_service.dto.QuizSummaryResponse;
import com.pwd.assessment_service.service.AssessmentService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/courses")
public class CourseController {
    private final AssessmentService assessmentService;

    public CourseController(AssessmentService assessmentService) {
        this.assessmentService = assessmentService;
    }

    @GetMapping("/{courseId}/quizzes")
    public List<QuizSummaryResponse> listQuizzes(@PathVariable Long courseId) {
        return assessmentService.listQuizzes(courseId);
    }

    @PostMapping("/{courseId}/quizzes")
    public ResponseEntity<QuizSummaryResponse> createQuiz(@PathVariable Long courseId,
                                                          @RequestBody QuizRequest request) {
        QuizSummaryResponse response = assessmentService.createQuiz(courseId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{courseId}/quizzes/{quizId}")
    public QuizResponse getQuiz(@PathVariable Long courseId, @PathVariable Long quizId) {
        return assessmentService.getQuiz(courseId, quizId);
    }

    @DeleteMapping("/{courseId}/quizzes/{quizId}")
    public ResponseEntity<Void> deleteQuiz(@PathVariable Long courseId, @PathVariable Long quizId) {
        assessmentService.deleteQuiz(courseId, quizId);
        return ResponseEntity.noContent().build();
    }
}
