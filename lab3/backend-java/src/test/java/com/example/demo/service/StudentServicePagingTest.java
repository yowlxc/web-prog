package com.example.demo.service;

import com.example.demo.exception.BadRequestException;
import com.example.demo.model.Student;
import com.example.demo.repository.StudentRepository;
import org.junit.jupiter.api.Test;

import java.util.List;

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
                null, null, null, null, "isu", "desc", 1, 1);

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

    private Student student(int isu, String fio, String group) {
        Student student = new Student();
        student.setIsu(isu);
        student.setFio(fio);
        student.setGroup(group);
        return student;
    }
}
