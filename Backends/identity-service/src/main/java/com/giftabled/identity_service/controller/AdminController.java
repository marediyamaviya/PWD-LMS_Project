package com.giftabled.identity_service.controller;

import com.giftabled.identity_service.dto.UserResponse;
import com.giftabled.identity_service.entity.User;
import com.giftabled.identity_service.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final UserService userService;

    public AdminController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/dashboard")
    public String adminDashboard() {
        return "Welcome Admin!";
    }

    @GetMapping("/trainers")
    public List<UserResponse> getTrainers() {
        return userService.getUsersByRole(User.Role.TRAINER);
    }
}
