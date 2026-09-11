package com.giftabled.course_service.config;

import com.giftabled.course_service.security.JwtAuthenticationFilter;
import com.giftabled.course_service.security.JwtService;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter(
            JwtService jwtService
    ) {
        return new JwtAuthenticationFilter(jwtService);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JwtAuthenticationFilter jwtAuthenticationFilter
    ) throws Exception {

        http
                .csrf(AbstractHttpConfigurer::disable)

                .authorizeHttpRequests(auth -> auth

                        // ADMIN
                        .requestMatchers(
                                HttpMethod.POST,
                                "/courses"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/courses/*"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/courses/*"
                        ).hasRole("ADMIN")


                        // TRAINER
                        .requestMatchers(
                                "/courses/my"
                        ).hasRole("TRAINER")

                        .requestMatchers(
                                HttpMethod.POST,
                                "/courses/*/modules"
                        ).hasRole("TRAINER")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/courses/*/modules/*"
                        ).hasRole("TRAINER")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/courses/*/modules/*"
                        ).hasRole("TRAINER")


                        // CANDIDATE
                        .requestMatchers(
                                "/courses/available"
                        ).hasRole("CANDIDATE")

                        .requestMatchers(
                                HttpMethod.POST,
                                "/courses/*/enroll"
                        ).hasRole("CANDIDATE")

                        .requestMatchers(
                                "/courses/enrolled"
                        ).hasRole("CANDIDATE")

                        .requestMatchers(
                                HttpMethod.PATCH,
                                "/courses/*/modules/*/progress"
                        ).hasRole("CANDIDATE")


                        // Any authenticated user
                        .anyRequest().authenticated()
                )

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}