package com.example.demo.dto;

import java.time.LocalDate;

public record StudentFilterRequest(
        Integer roomMin,
        Integer roomMax,
        String group,
        String fio,
        Integer isu,
        Integer dormNumber,
        Boolean isForeign,
        LocalDate dateFrom,
        LocalDate dateTo,
        String notes
) {}
