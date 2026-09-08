package com.giftabled.pwd_lms_core.service;

import com.giftabled.pwd_lms_core.dto.AuthResponse;
import com.giftabled.pwd_lms_core.dto.RegisterRequest;
import com.giftabled.pwd_lms_core.entity.User;
import com.giftabled.pwd_lms_core.exception.EmailAlreadyExistsException;
import com.giftabled.pwd_lms_core.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
}
