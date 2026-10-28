package com.example.demo.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record StudentPatchRequest(
        @Size(min = 2, max = 50)
        @Pattern(regexp = "^[А-Яа-яЁё]+(?: [А-Яа-яЁё]+)+$") String fio,
        @Pattern(regexp = "^[A-Z][1-9][0-9]{3}$") String group,
        @Min(1) @Max(100) Integer dormNumber,
        @Min(1) @Max(99999) Integer roomNumber,
        LocalDate dateInDorm,
        Boolean isForeign,
        @Size(max = 300) String notes
) {
    @AssertTrue(message = "Дата заселения должна быть от 1999-01-01 до текущей даты")
    public boolean isDateInDormValid() {
        return dateInDorm == null ||
                (!dateInDorm.isBefore(LocalDate.of(1999, 1, 1))
                && !dateInDorm.isAfter(LocalDate.now()));
    }
}
