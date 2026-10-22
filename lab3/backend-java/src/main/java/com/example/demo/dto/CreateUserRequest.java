package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateUserRequest(

    @NotBlank(message = "Укажите имя")
    @Size(
        min = 3,
        max = 30,
        message = "Имя должно содержать от 3 до 30 символов"
    )
    @Pattern(
        regexp = "^[A-Za-zА-Яа-яЁё]+$",
        message = "В имени разрешены латинские буквы и кириллица"
    )
    String name,

    @NotBlank(message = "Укажите логин")
    @Size(
        min = 3,
        max = 30,
        message = "Логин должен содержать от 3 до 30 символов"
    )
    @Pattern(
        regexp = "^[A-Za-z0-9_]+$",
        message = "В логине разрешены латинские буквы, цифры и _"
    )
    String login,

    @NotBlank(message = "Укажите пароль")
    @Size(
        min = 6,
        max = 64,
        message = "Пароль должен содержать от 6 до 64 символов"
    )
    String password
) {
}