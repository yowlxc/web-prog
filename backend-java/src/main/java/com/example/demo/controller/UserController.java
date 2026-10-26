package com.example.demo.controller;

import com.example.demo.dto.CreateUserRequest;

public class UserController(
    @Valid @RequestBody CreateUserRequest request
) {
    return UserService.create(request);
}