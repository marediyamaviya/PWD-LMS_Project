package com.giftabled.identity_service.service;

import com.giftabled.identity_service.dto.AuthResponse;
import com.giftabled.identity_service.dto.RegisterRequest;
import com.giftabled.identity_service.entity.User;
import com.giftabled.identity_service.exception.EmailAlreadyExistsException;
import com.giftabled.identity_service.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.giftabled.identity_service.dto.UserResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,PasswordEncoder passwordEncoder){
        this.userRepository=userRepository;
        this.passwordEncoder=passwordEncoder;
    }
    public AuthResponse registerUser(RegisterRequest request){
        if (userRepository.existsByEmail(request.getEmail())){
            throw new EmailAlreadyExistsException("Email already registerd");
        }
        User user =new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());


        User saveuser=userRepository.save(user);
         return new AuthResponse(
           saveuser.getRole().name()+ "User registered succesfully",
           saveuser.getEmail(),
           saveuser.getRole() .name()
         );



    }
    public UserResponse getUserByEmail(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found with email: " + email)
                );

        return toUserResponse(user);
    }

    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found with id: " + id)
                );

        return toUserResponse(user);
    }

    public List<UserResponse> getUsersByRole(User.Role role) {
        return userRepository.findByRole(role).stream()
                .map(this::toUserResponse)
                .toList();
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    private UserResponse toUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        );
    }
}
