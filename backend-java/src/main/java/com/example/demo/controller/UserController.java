package com.example.demo.controller;

public class UserController(
    @Valid @RequestBody CreateUserRequest request
) {
    return UserService.create(request);
}