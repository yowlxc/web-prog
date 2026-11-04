package com.example.demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record EmailRequest(

        @NotBlank(message = "Укажите email")
        @Email(message = "Введите корректный адрес электронной почты")
        @Size(max = 254, message = "Email слишком длинный")
        String email,

        @NotBlank(message = "Укажите пароль")
        String password
) {}