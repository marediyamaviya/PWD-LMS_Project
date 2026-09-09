package com.giftabled.identity_service.dto;


import com.giftabled.identity_service.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    @NotBlank(message = "Name is required")
    private String name;
    @NotBlank(message = "Email is required")
    @Email(message = "Please enter vslid email ")
    private String email;
    @NotBlank(message = "Password is required")
    private String password;
    @NotNull(message = "Role is required")
    private User.Role role;
}
