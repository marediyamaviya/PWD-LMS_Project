package com.giftabled.course_service.service;

import com.giftabled.course_service.entity.CourseModule;
import com.giftabled.course_service.repository.CourseModuleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseModuleService {

    private final CourseModuleRepository moduleRepository;

    public CourseModuleService(
            CourseModuleRepository moduleRepository
    ) {
        this.moduleRepository = moduleRepository;
    }

    public List<CourseModule> getModules(Long courseId) {

        return moduleRepository
                .findByCourseIdOrderByModuleOrder(courseId);
    }

    public CourseModule createModule(
            Long courseId,
            CourseModule module
    ) {

        module.setCourseId(courseId);

        return moduleRepository.save(module);
    }

    public CourseModule updateModule(
            Long moduleId,
            CourseModule updatedModule
    ) {

        CourseModule existing =
                moduleRepository.findById(moduleId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Module not found with id: " + moduleId
                                )
                        );

        existing.setTitle(updatedModule.getTitle());
        existing.setModuleOrder(updatedModule.getModuleOrder());
        existing.setContent(updatedModule.getContent());

        return moduleRepository.save(existing);
    }

    public void deleteModule(Long moduleId) {

        CourseModule module =
                moduleRepository.findById(moduleId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Module not found with id: " + moduleId
                                )
                        );

        moduleRepository.delete(module);
    }
}