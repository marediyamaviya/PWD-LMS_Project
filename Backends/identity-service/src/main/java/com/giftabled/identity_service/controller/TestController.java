package com.giftabled.identity_service.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
public class TestController {
     @GetMapping("/protected")
    public String protectedEnPoints(){
         return "Jwt Authentication is working ";
     }
}
