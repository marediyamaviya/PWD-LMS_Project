package com.giftabled.pwd_lms_core.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/candidate")
public class CandidateController {
    @GetMapping("/dashboard")
    public String candidateDashboard(){
        return "Welcome Candidate !!";

    }
}
