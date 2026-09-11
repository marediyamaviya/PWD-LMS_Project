package com.giftabled.course_service.controller;

import com.giftabled.course_service.entity.ModuleProgress;
import com.giftabled.course_service.service.ProgressService;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/courses")
public class ProgressController {

    private final ProgressService progressService;

    public ProgressController(
            ProgressService progressService
    ) {
        this.progressService = progressService;
    }

    @PatchMapping(
            "/{courseId}/modules/{moduleId}/progress"
    )
    public ModuleProgress updateProgress(

            @PathVariable Long courseId,

            @PathVariable Long moduleId,

            @RequestParam Long candidateId,

            @RequestParam Integer progressPercent
    ) {

        return progressService.updateProgress(
                courseId,
                moduleId,
                candidateId,
                progressPercent
        );
    }
}