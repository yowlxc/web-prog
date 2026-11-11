package com.example.demo.service;

import com.example.demo.exception.BadRequestException;
import com.example.demo.model.Student;
import com.example.demo.repository.StudentRepository;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class StudentServicePagingTest {
    @Test
    void filtersSortsAndReturnsRequestedPage() {
        StudentRepository repository = mock(StudentRepository.class);
        when(repository.findAll()).thenReturn(List.of(
                student(123456, "Иванов Иван", "P1234"),
                student(234567, "Петров Пётр", "P1234"),
                student(345678, "Сидоров Сидор", "P4321")
        ));
        StudentService service = new StudentService(repository);

        List<Student> result = service.filterStudents(null, null, "P1234",
                null, null, null, null, null, null, null, "isu", "desc", 1, 1);

        assertEquals(1, result.size());
        assertEquals(123456, result.get(0).getIsu());
    }

    @Test
    void rejectsInvalidPageAndSortField() {
        StudentService service = new StudentService(mock(StudentRepository.class));

        assertThrows(BadRequestException.class,
                () -> service.getAllStudents("isu", "asc", -1, 20));
        assertThrows(BadRequestException.class,
                () -> service.getAllStudents("unknown", "asc", 0, 20));
    }

    @Test
    void searchesNameNotesAndDate() {
        StudentRepository repository = mock(StudentRepository.class);
        Student first = student(123456, "Иванов Иван", "P1234");
        first.setDateInDorm(LocalDate.of(2024, 9, 1));
        first.setNotes("Тихая комната");
        first.setIsForeign(false);
        Student second = student(234567, "Петров Пётр", "P1234");
        second.setDateInDorm(LocalDate.of(2025, 9, 1));
        second.setNotes("Другая запись");
        second.setIsForeign(true);
        when(repository.findAll()).thenReturn(List.of(first, second));

        List<Student> result = new StudentService(repository).filterStudents(
                null, null, null, "иван", null, null, false,
                LocalDate.of(2024, 1, 1), LocalDate.of(2024, 12, 31), "КОМНАТА",
                "isu", "asc", 0, 8);

        assertEquals(List.of(first), result);
    }

    private Student student(int isu, String fio, String group) {
        Student student = new Student();
        student.setIsu(isu);
        student.setFio(fio);
        student.setGroup(group);
        return student;
    }
}
