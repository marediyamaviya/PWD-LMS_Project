package com.giftabled.identity_service.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/coordinator")
public class CoordinatorController {
    @GetMapping("/dashboard")
    public String CoordinatorDashboard(){
        return "Welcome Coordinator!!";

    }
}
