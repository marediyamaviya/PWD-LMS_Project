package com.giftabled.course_service.repository;

import com.giftabled.course_service.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {

    List<Course> findByTrainerId(Long trainerId);
    List<Course> findByStatusIgnoreCase(String status);
}