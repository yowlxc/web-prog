package com.example.demo.service;

import com.example.demo.dto.StudentResponse;
import com.example.demo.exception.StudentNotFoundException;
import com.example.demo.model.Student;
import com.example.demo.repository.StudentRepository;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class StudentServiceTest {
    @Test
    void filtersSortsAndPaginates() {
        StudentRepository repository = mock(StudentRepository.class);
        when(repository.findAll()).thenReturn(List.of(
                student(123456, "Иванов Иван", "P1234"),
                student(234567, "Петров Пётр", "P1234"),
                student(345678, "Сидоров Сидор", "P4321")
        ));
        StudentService service = new StudentService(repository);

        List<StudentResponse> page = service.getStudents(null, null, "P1234",
                null, null, null, null, "isu", "desc", 1, 1);

        assertEquals(1, page.size());
        assertEquals(123456, page.get(0).isu());
    }

    @Test
    void missingStudentReturnsNotFoundException() {
        StudentRepository repository = mock(StudentRepository.class);
        when(repository.findById(123456)).thenReturn(Optional.empty());
        StudentService service = new StudentService(repository);

        assertThrows(StudentNotFoundException.class, () -> service.deleteStudent(123456));
    }

    private Student student(int isu, String fio, String group) {
        Student student = new Student();
        student.setIsu(isu);
        student.setFio(fio);
        student.setGroup(group);
        student.setDormNumber(1);
        student.setRoomNumber(101);
        student.setIsForeign(false);
        return student;
    }
}
