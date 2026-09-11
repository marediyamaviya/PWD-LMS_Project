package com.giftabled.course_service.controller;

import com.giftabled.course_service.dto.CreateCourseRequest;
import com.giftabled.course_service.entity.Course;
import com.giftabled.course_service.service.CourseService;

import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/courses")
public class CourseController {

    private final CourseService courseService;

    @GetMapping("/available")
    public List<Course> getAvailableCourses() {

        return courseService.getAvailableCourses();
    }

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    // CREATE COURSE
    @PostMapping
    public Course createCourse(
            @RequestBody CreateCourseRequest request ){
        return courseService.createCourse(request);
    }

    // GET ALL COURSES
    @GetMapping
    public List<Course> getAllCourses() {

        return courseService.getAllCourses();
    }

    // GET COURSE BY ID
    @GetMapping("/{id}")
    public Course getCourseById(@PathVariable Long id) {

        return courseService.getCourseById(id);
    }

    // UPDATE COURSE
    @PutMapping("/{id}")
    public Course updateCourse(
            @PathVariable Long id,
            @RequestBody Course course
    ) {

        return courseService.updateCourse(id, course);
    }

    // DELETE COURSE
    @DeleteMapping("/{id}")
    public String deleteCourse(@PathVariable Long id) {

        courseService.deleteCourse(id);

        return "Course deleted successfully";
    }
    @GetMapping("/my")
    public List<Course> getMyCourses(Authentication authentication) {

        return courseService.getCoursesByTrainer(authentication.getName());
    }
}