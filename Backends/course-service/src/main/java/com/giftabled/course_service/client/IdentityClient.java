package com.giftabled.course_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "IDENTITY-SERVICE", url = "${AUTH_SERVICE_URL:https://lms-identity-service.onrender.com}")
public interface IdentityClient {

    @GetMapping("/users/{id}")
    UserResponse getUserById(@PathVariable Long id);
    @GetMapping("/users/email/{email}")
    UserResponse getUserByEmail(@PathVariable String email);
}