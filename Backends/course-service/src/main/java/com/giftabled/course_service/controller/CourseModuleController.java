package com.giftabled.course_service.controller;

import com.giftabled.course_service.entity.CourseModule;
import com.giftabled.course_service.service.CourseModuleService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/courses")
public class CourseModuleController {

    private final CourseModuleService moduleService;

    public CourseModuleController(
            CourseModuleService moduleService
    ) {
        this.moduleService = moduleService;
    }

    @GetMapping("/{courseId}/modules")
    public List<CourseModule> getModules(
            @PathVariable Long courseId
    ) {

        return moduleService.getModules(courseId);
    }

    @PostMapping("/{courseId}/modules")
    public CourseModule createModule(
            @PathVariable Long courseId,
            @RequestBody CourseModule module
    ) {

        return moduleService.createModule(courseId, module);
    }

    @PutMapping("/{courseId}/modules/{moduleId}")
    public CourseModule updateModule(
            @PathVariable Long moduleId,
            @RequestBody CourseModule module
    ) {

        return moduleService.updateModule(moduleId, module);
    }

    @DeleteMapping("/{courseId}/modules/{moduleId}")
    public String deleteModule(
            @PathVariable Long moduleId
    ) {

        moduleService.deleteModule(moduleId);

        return "Module deleted successfully";
    }
}