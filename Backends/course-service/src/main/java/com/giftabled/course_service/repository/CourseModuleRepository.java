package com.giftabled.course_service.repository;

import com.giftabled.course_service.entity.CourseModule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseModuleRepository
        extends JpaRepository<CourseModule, Long> {

    List<CourseModule> findByCourseIdOrderByModuleOrder(Long courseId);
}