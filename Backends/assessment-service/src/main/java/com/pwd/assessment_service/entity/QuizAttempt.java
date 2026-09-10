package com.pwd.assessment_service.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "quiz_attempts")
public class QuizAttempt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String candidateId;
    private int score;
    private int totalPoints;
    private Instant submittedAt;

    @ManyToOne
    private Quiz quiz;

    protected QuizAttempt() {
    }

    public QuizAttempt(String candidateId, Quiz quiz, int score, int totalPoints) {
        this.candidateId = candidateId;
        this.quiz = quiz;
        this.score = score;
        this.totalPoints = totalPoints;
        this.submittedAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public String getCandidateId() {
        return candidateId;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public int getTotalPoints() {
        return totalPoints;
    }

    public Instant getSubmittedAt() {
        return submittedAt;
    }

    public Quiz getQuiz() {
        return quiz;
    }

}
