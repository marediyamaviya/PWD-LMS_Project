package com.giftabled.api_gateway.config;

import java.io.IOException;
import java.util.Collections;
import java.util.Enumeration;
import java.util.List;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;

import org.springframework.stereotype.Component;

@Component
public class NoContentEncodingFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        chain.doFilter(new HttpServletRequestWrapper(httpRequest) {
            @Override
            public String getHeader(String name) {
                if ("accept-encoding".equalsIgnoreCase(name)) {
                    return "identity";
                }
                return super.getHeader(name);
            }

            @Override
            public Enumeration<String> getHeaders(String name) {
                if ("accept-encoding".equalsIgnoreCase(name)) {
                    return Collections.enumeration(List.of("identity"));
                }
                return super.getHeaders(name);
            }
        }, response);
    }
}