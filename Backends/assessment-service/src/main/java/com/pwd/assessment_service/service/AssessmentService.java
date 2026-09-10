package com.pwd.assessment_service.service;

import com.pwd.assessment_service.dto.AnswerSubmission;
import com.pwd.assessment_service.dto.AttemptResponse;
import com.pwd.assessment_service.dto.OptionRequest;
import com.pwd.assessment_service.dto.OptionResponse;
import com.pwd.assessment_service.dto.QuestionRequest;
import com.pwd.assessment_service.dto.QuestionResponse;
import com.pwd.assessment_service.dto.QuizRequest;
import com.pwd.assessment_service.dto.QuizResponse;
import com.pwd.assessment_service.dto.QuizSummaryResponse;
import com.pwd.assessment_service.dto.SubmitAttemptRequest;
import com.pwd.assessment_service.entity.Question;
import com.pwd.assessment_service.entity.Quiz;
import com.pwd.assessment_service.entity.QuizAttempt;
import com.pwd.assessment_service.entity.Option;
import com.pwd.assessment_service.exception.BadRequestException;
import com.pwd.assessment_service.exception.MaxAttemptsExceededException;
import com.pwd.assessment_service.exception.ResourceNotFoundException;
import com.pwd.assessment_service.repository.QuestionRepository;
import com.pwd.assessment_service.repository.QuizAttemptRepository;
import com.pwd.assessment_service.repository.QuizRepository;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class AssessmentService {
    private static final int MAX_ATTEMPTS = 3;

    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final QuizAttemptRepository attemptRepository;

    public AssessmentService(QuizRepository quizRepository,
                             QuestionRepository questionRepository,
                             QuizAttemptRepository attemptRepository) {
        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
        this.attemptRepository = attemptRepository;
    }

    public QuizSummaryResponse createQuiz(Long courseId, QuizRequest request) {
        Quiz quiz = new Quiz(request.title().trim(), request.description(), courseId);
        return toSummary(quizRepository.save(quiz));
    }

    public List<QuizSummaryResponse> listQuizzes(Long courseId) {
        return quizRepository.findByCourseIdOrderById(courseId).stream()
                .map(this::toSummary).toList();
    }

    public QuizResponse getQuiz(Long courseId, Long quizId) {
        return toQuizResponse(quizRepository.findByIdAndCourseId(quizId, courseId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Quiz " + quizId + " was not found for course " + courseId)));
    }

    public QuizResponse getQuiz(Long quizId) {
        return toQuizResponse(findQuiz(quizId));
    }

    public void deleteQuiz(Long courseId, Long quizId) {
        Quiz quiz = quizRepository.findByIdAndCourseId(quizId, courseId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Quiz " + quizId + " was not found for course " + courseId));
        quizRepository.delete(quiz);
    }

    public void deleteQuiz(Long quizId) {
        quizRepository.delete(findQuiz(quizId));
    }

    public QuestionResponse addQuestion(Long quizId, QuestionRequest request) {
        Quiz quiz = findQuiz(quizId);
        validateOptions(request.options());
        int points = request.points() == null ? 1 : request.points();
        Question question = new Question(request.text().trim(), points, quiz);
        for (OptionRequest optionRequest : request.options()) {
            question.addOption(new Option(optionRequest.text().trim(), optionRequest.correct(),
                    question));
        }
        quiz.addQuestion(question);
        return toQuestionResponse(questionRepository.save(question));
    }

    public void deleteQuestion(Long quizId, Long questionId) {
        Question question = questionRepository.findByIdAndQuizId(questionId, quizId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Question " + questionId + " was not found for quiz " + quizId));
        questionRepository.delete(question);
    }

    public AttemptResponse submitAttempt(Long quizId, SubmitAttemptRequest request) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz " + quizId + " was not found"));
        if (attemptRepository.countByQuizIdAndCandidateId(quizId, request.candidateId().trim())
                >= MAX_ATTEMPTS) {
            throw new MaxAttemptsExceededException(
                    "Candidate has already used the maximum of 3 attempts for this quiz");
        }

        Map<Long, Question> questions = new HashMap<>();
        for (Question question : quiz.getQuestions()) {
            questions.put(question.getId(), question);
        }
        if (questions.isEmpty()) {
            throw new BadRequestException("A quiz must contain at least one question");
        }
        Map<Long, AnswerSubmission> submissions = new HashMap<>();
        for (AnswerSubmission answer : request.answers()) {
            if (submissions.put(answer.questionId(), answer) != null) {
                throw new BadRequestException("Each question may only be answered once");
            }
        }
        if (!submissions.keySet().equals(questions.keySet())) {
            throw new BadRequestException("An answer is required for every question");
        }

        int totalPoints = questions.values().stream().mapToInt(Question::getPoints).sum();
        int score = 0;
        QuizAttempt attempt = new QuizAttempt(request.candidateId().trim(), quiz, 0, totalPoints);
        for (Question question : questions.values()) {
            AnswerSubmission submission = submissions.get(question.getId());
            Option selected = question.getOptions().stream()
                    .filter(option -> option.getId().equals(submission.optionId()))
                    .findFirst()
                    .orElseThrow(() -> new BadRequestException(
                            "Option " + submission.optionId() + " does not belong to question "
                                    + question.getId()));
            boolean correct = selected.isCorrect();
            if (correct) {
                score += question.getPoints();
            }
        }
        QuizAttempt saved = attemptRepository.save(attemptWithScore(attempt, score));
        return toAttemptResponse(saved);
    }

    public List<AttemptResponse> getAttempts(Long quizId, String candidateId) {
        findQuiz(quizId);
        List<QuizAttempt> attempts = candidateId == null || candidateId.isBlank()
                ? attemptRepository.findByQuizIdOrderBySubmittedAtDesc(quizId)
                : attemptRepository.findByQuizIdAndCandidateIdOrderBySubmittedAtDesc(
                        quizId, candidateId.trim());
        return attempts.stream().map(this::toAttemptResponse).toList();
    }

    private QuizAttempt attemptWithScore(QuizAttempt attempt, int score) {
        // Score is assigned through a small service helper to keep the entity immutable to callers.
        attempt.setScore(score);
        return attempt;
    }

    private Quiz findQuiz(Long quizId) {
        return quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz " + quizId + " was not found"));
    }

    private void validateOptions(List<OptionRequest> options) {
        long correctCount = options.stream().filter(OptionRequest::correct).count();
        if (correctCount != 1) {
            throw new BadRequestException("A question must have exactly one correct option");
        }
    }

    private QuizSummaryResponse toSummary(Quiz quiz) {
        return new QuizSummaryResponse(quiz.getId(), quiz.getTitle(), quiz.getDescription(),
                quiz.getCourseId(), quiz.getQuestions().size());
    }

    private QuizResponse toQuizResponse(Quiz quiz) {
        return new QuizResponse(quiz.getId(), quiz.getTitle(), quiz.getDescription(),
                quiz.getCourseId(), quiz.getQuestions().stream()
                        .map(question -> toQuestionResponse(question, false)).toList());
    }

    private QuestionResponse toQuestionResponse(Question question) {
        return toQuestionResponse(question, true);
    }

    private QuestionResponse toQuestionResponse(Question question, boolean includeCorrectAnswer) {
        return new QuestionResponse(question.getId(), question.getText(), question.getPoints(),
                question.getOptions().stream()
                        .map(option -> new OptionResponse(option.getId(), option.getText(),
                                includeCorrectAnswer && option.isCorrect())).toList());
    }

    private AttemptResponse toAttemptResponse(QuizAttempt attempt) {
        return new AttemptResponse(attempt.getId(), attempt.getQuiz().getId(),
                attempt.getCandidateId(), attempt.getScore(), attempt.getTotalPoints(),
                attempt.getSubmittedAt());
    }

}
