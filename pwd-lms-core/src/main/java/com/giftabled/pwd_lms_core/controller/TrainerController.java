package com.giftabled.pwd_lms_core.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/trainer")
public class TrainerController {
    @GetMapping("/dashboard")
    public String trainerDashboard() {
        return "Welcome Trainer!";
    }
}
