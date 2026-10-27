package com.example.demo.dto;

import com.example.demo.model.Role;

public record UserResponse(
        Long id,
        String name,
        String login,
        Role role
) {
}