package com.example.demo.controller;

import com.example.demo.dto.CreateUserRequest;
import com.example.demo.dto.ChangeRoleRequest;
import com.example.demo.dto.UserResponse;
import com.example.demo.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse create(
        @Valid @RequestBody CreateUserRequest request
    ) {
        return userService.create(request);
    }

    @PatchMapping("/{id}/role")
    @ResponseStatus(HttpStatus.OK)
    public UserResponse changeRole(
        @PathVariable("id") Long id,
        @Valid @RequestBody ChangeRoleRequest request
    ) {
        return userService.changeRole(id, request.role());
    }




}
