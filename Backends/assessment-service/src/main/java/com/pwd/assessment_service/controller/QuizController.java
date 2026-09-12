package com.pwd.assessment_service.controller;

import com.pwd.assessment_service.dto.AttemptResponse;
import com.pwd.assessment_service.dto.QuestionRequest;
import com.pwd.assessment_service.dto.QuestionResponse;
import com.pwd.assessment_service.dto.QuizRequest;
import com.pwd.assessment_service.dto.QuizResponse;
import com.pwd.assessment_service.dto.QuizSummaryResponse;
import com.pwd.assessment_service.dto.SubmitAttemptRequest;
import com.pwd.assessment_service.service.AssessmentService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {
    private final AssessmentService assessmentService;

    public QuizController(AssessmentService assessmentService) {
        this.assessmentService = assessmentService;
    }

    @GetMapping
    public List<QuizSummaryResponse> searchQuizzes(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String assessmentName,
            @RequestParam(required = false) String title) {
        return assessmentService.searchQuizzes(name != null ? name
                : assessmentName != null ? assessmentName : title);
    }

    @GetMapping("/search")
    public List<QuizSummaryResponse> searchQuizzesByPath(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String assessmentName,
            @RequestParam(required = false) String title) {
        return assessmentService.searchQuizzes(name != null ? name
                : assessmentName != null ? assessmentName : title);
    }

    @GetMapping("/course/{courseId}")
    public List<QuizSummaryResponse> listQuizzesByCourse(@PathVariable Long courseId) {
        return assessmentService.listQuizzes(courseId);
    }

    @PostMapping
    public ResponseEntity<QuizSummaryResponse> createQuiz(@RequestBody QuizRequest request) {
        return ResponseEntity.ok(assessmentService.createQuiz(request));
    }

    @GetMapping("/{quizId}")
    public QuizResponse getQuiz(@PathVariable Long quizId) {
        return assessmentService.getQuiz(quizId);
    }

    @DeleteMapping("/{quizId}")
    public ResponseEntity<Void> deleteQuiz(@PathVariable Long quizId) {
        assessmentService.deleteQuiz(quizId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{quizId}")
    public QuizSummaryResponse updateQuiz(@PathVariable Long quizId,
                                          @RequestBody QuizRequest request) {
        return assessmentService.updateQuiz(quizId, request);
    }

    @PostMapping("/{quizId}/questions")
    public ResponseEntity<QuestionResponse> addQuestion(@PathVariable Long quizId,
                                                        @RequestBody QuestionRequest request) {
        QuestionResponse response = assessmentService.addQuestion(quizId, request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{quizId}/questions/{questionId}")
    public QuestionResponse updateQuestion(@PathVariable Long quizId,
                                           @PathVariable Long questionId,
                                           @RequestBody QuestionRequest request) {
        return assessmentService.updateQuestion(quizId, questionId, request);
    }

    @DeleteMapping("/{quizId}/questions/{questionId}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long quizId,
                                               @PathVariable Long questionId) {
        assessmentService.deleteQuestion(quizId, questionId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{quizId}/attempts")
    public ResponseEntity<AttemptResponse> submitAttempt(@PathVariable Long quizId,
                                                         @RequestBody SubmitAttemptRequest request) {
        AttemptResponse response = assessmentService.submitAttempt(quizId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{quizId}/attempts")
    public List<AttemptResponse> getAttempts(@PathVariable Long quizId,
                                             @RequestParam(required = false) String candidateId) {
        return assessmentService.getAttempts(quizId, candidateId);
    }
}
