package com.example.demo.dto;

public record StudentFilterRequest(
        Integer roomMin,
        Integer roomMax,
        String group,
        String fio,
        Integer isu,
        Integer dormNumber,
        Boolean isForeign
) {}