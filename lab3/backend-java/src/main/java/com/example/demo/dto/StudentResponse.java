package com.example.demo.dto;

import com.example.demo.model.Student;
import java.time.LocalDate;

public record StudentResponse(
        Integer isu,
        String fio,
        String group,
        Integer dormNumber,
        Integer roomNumber,
        LocalDate dateInDorm,
        Boolean isForeign,
        String notes
) {
    public static StudentResponse from(Student student) {
        return new StudentResponse(
                student.getIsu(), student.getFio(), student.getGroup(),
                student.getDormNumber(), student.getRoomNumber(),
                student.getDateInDorm(), student.getIsForeign(), student.getNotes()
        );
    }
}
