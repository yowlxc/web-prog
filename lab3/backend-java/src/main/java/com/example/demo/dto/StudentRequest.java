package com.example.demo.dto;

import com.example.demo.model.Student;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record StudentRequest(
        @NotNull @Min(100000) @Max(999999) Integer isu,
        @NotBlank @Size(min = 2, max = 50)
        @Pattern(regexp = "^[А-Яа-яЁё]+(?: [А-Яа-яЁё]+)+$") String fio,
        @NotBlank @Pattern(regexp = "^[A-Z][1-9][0-9]{3}$") String group,
        @NotNull @Min(1) @Max(100) Integer dormNumber,
        @NotNull @Min(1) @Max(99999) Integer roomNumber,
        @NotNull LocalDate dateInDorm,
        @NotNull Boolean isForeign,
        @Size(max = 300) String notes
) {
    @AssertTrue(message = "Дата заселения должна быть от 1999-01-01 до текущей даты")
    public boolean isDateInDormValid() {
        return dateInDorm == null ||
                (!dateInDorm.isBefore(LocalDate.of(1999, 1, 1))
                && !dateInDorm.isAfter(LocalDate.now()));
    }

    public Student toStudent() {
        Student student = new Student();
        student.setIsu(isu);
        student.setFio(fio);
        student.setGroup(group);
        student.setDormNumber(dormNumber);
        student.setRoomNumber(roomNumber);
        student.setDateInDorm(dateInDorm);
        student.setIsForeign(isForeign);
        student.setNotes(notes == null ? "" : notes);
        return student;
    }
}
