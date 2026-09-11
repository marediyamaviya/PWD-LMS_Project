package com.giftabled.course_service.service;

import com.giftabled.course_service.client.IdentityClient;
import com.giftabled.course_service.client.UserResponse;
import com.giftabled.course_service.entity.Course;
import com.giftabled.course_service.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.giftabled.course_service.dto.CreateCourseRequest;

import java.util.List;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final IdentityClient identityClient;

    public CourseService(
            CourseRepository courseRepository,
            IdentityClient identityClient
    ) {
        this.courseRepository = courseRepository;
        this.identityClient = identityClient;
    }


    public Course createCourse(CreateCourseRequest request) {

        Course course = new Course();

        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setCategory(request.getCategory());
        course.setDuration(request.getDuration());
        course.setTrainerId(request.getTrainerId());
        course.setStatus(request.getStatus());

        return courseRepository.save(course);
    }
    // GET ALL
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    // GET BY ID
    public Course getCourseById(Long id) {

        return courseRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Course not found with id: " + id)
                );
    }

    // UPDATE
    public Course updateCourse(Long id, Course updatedCourse) {

        Course existingCourse = courseRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Course not found with id: " + id)
                );

        existingCourse.setTitle(updatedCourse.getTitle());
        existingCourse.setDescription(updatedCourse.getDescription());
        existingCourse.setCategory(updatedCourse.getCategory());
        existingCourse.setDuration(updatedCourse.getDuration());
        existingCourse.setTrainerId(updatedCourse.getTrainerId());
        existingCourse.setStatus(updatedCourse.getStatus());

        return courseRepository.save(existingCourse);
    }

    // DELETE
    public void deleteCourse(Long id) {

        Course existingCourse = courseRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Course not found with id: " + id)
                );

        courseRepository.delete(existingCourse);
    }
    public List<Course> getCoursesByTrainer(String email) {

        UserResponse user = identityClient.getUserByEmail(email);

        return courseRepository.findByTrainerId(user.getId());
    }
    public List<Course> getAvailableCourses() {
        return courseRepository.findByStatusIgnoreCase("PUBLISHED");
    }
}