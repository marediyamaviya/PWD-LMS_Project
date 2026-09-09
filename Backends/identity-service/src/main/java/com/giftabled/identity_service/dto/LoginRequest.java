package com.giftabled.identity_service.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {
    @NotBlank(message = "Email  is required")
    @Email(message = "Please Enter valid Email")
    private String email;
    @NotBlank(message = "Password is required")
    private String password;

}

