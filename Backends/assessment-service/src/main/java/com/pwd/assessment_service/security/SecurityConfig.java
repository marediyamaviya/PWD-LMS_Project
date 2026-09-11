package com.pwd.assessment_service.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.GET, "/api/courses/**", "/api/quizzes/**")
                        .hasAnyRole("ADMIN", "TRAINER", "CANDIDATE")
                        .requestMatchers(HttpMethod.POST, "/api/quizzes/*/attempts")
                        .hasRole("CANDIDATE")
                        .requestMatchers(HttpMethod.POST, "/api/courses/**", "/api/quizzes")
                        .hasAnyRole("ADMIN", "TRAINER")
                        .requestMatchers(HttpMethod.POST, "/api/quizzes/*/questions", "/api/quizzes/*/questions/**")
                        .hasAnyRole("ADMIN", "TRAINER")
                        .requestMatchers(HttpMethod.PUT, "/api/quizzes/**")
                        .hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/quizzes/*/questions/*", "/api/quizzes/*/questions/**")
                        .hasAnyRole("ADMIN", "TRAINER")
                        .requestMatchers(HttpMethod.DELETE, "/api/courses/**", "/api/quizzes/**")
                        .hasAnyRole("ADMIN", "TRAINER")
                        .requestMatchers("/api/courses/**", "/api/quizzes/**")
                        .hasAnyRole("ADMIN", "TRAINER")
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}