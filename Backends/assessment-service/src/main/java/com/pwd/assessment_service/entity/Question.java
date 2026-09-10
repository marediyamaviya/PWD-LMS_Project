package com.pwd.assessment_service.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "questions")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String text;
    private Integer points;

    @ManyToOne
    private Quiz quiz;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL,
            fetch = jakarta.persistence.FetchType.EAGER)
    private final List<Option> options = new ArrayList<>();

    protected Question() {
    }

    public Question(String text, Integer points, Quiz quiz) {
        this.text = text;
        this.points = points;
        this.quiz = quiz;
    }

    public Long getId() {
        return id;
    }

    public String getText() {
        return text;
    }

    public Integer getPoints() {
        return points;
    }

    public Quiz getQuiz() {
        return quiz;
    }

    public void setQuiz(Quiz quiz) {
        this.quiz = quiz;
    }

    public List<Option> getOptions() {
        return options;
    }

    public void addOption(Option option) {
        options.add(option);
        option.setQuestion(this);
    }
}
