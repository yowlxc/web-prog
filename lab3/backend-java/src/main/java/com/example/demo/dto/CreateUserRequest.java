package com.example.demo.dto;

import jakarta.validation.constraints.Email;
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
        regexp = "^(?:[A-Za-z]+|[А-Яа-яЁё]+)$",
        message = "В имени разрешены латинские буквы или кириллица"
    )
    String name,

    @NotBlank(message = "Укажите email")
    @Email(message = "Введите корректный адрес электронной почты")
    @Size(
        max = 254,
        message = "Email не должен содержать более 254 символов"
    )
    String email,

    @NotBlank(message = "Укажите пароль")
    @Size(
        min = 6,
        max = 64,
        message = "Пароль должен содержать от 6 до 64 символов"
    )
    String password
) {}
