package com.example.demo.service;

import com.example.demo.model.Student;
import com.example.demo.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public List<Student> filterStudents(
            Integer roomMin,
            Integer roomMax,
            String group,
            String fio,
            Integer dormNumber,
            Boolean isForeign) {

        return studentRepository.findAll().stream()
                .filter(s -> roomMin == null || s.getRoomNumber() >= roomMin)
                .filter(s -> roomMax == null || s.getRoomNumber() <= roomMax)
                .filter(s -> group == null || s.getGroup().equals(group))
                .filter(s -> fio == null || s.getFio().equals(fio))
                .filter(s -> dormNumber == null || s.getDormNumber().equals(dormNumber))
                .filter(s -> isForeign == null || s.getIsForeign().equals(isForeign))
                .toList();
    }

    public Optional<Student> getStudentByIsu(String isu) {
        return studentRepository.findById(isu);
    }

    public Student createStudent(Student student) {
        if (studentRepository.existsById(student.getIsu())) {
            throw new IllegalArgumentException(
                    "Студент с таким ИСУ уже существует"
            );
        }

        return studentRepository.save(student);
    }

    public Student updateStudent(String isu, Student updatedStudent) {
        Student existing = studentRepository.findById(isu)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Студент не найден: " + isu
                ));

        if (updatedStudent.getFio() != null) {
            existing.setFio(updatedStudent.getFio());
        }
        if (updatedStudent.getGroup() != null) {
            existing.setGroup(updatedStudent.getGroup());
        }
        if (updatedStudent.getDormNumber() != null) {
            existing.setDormNumber(updatedStudent.getDormNumber());
        }
        if (updatedStudent.getRoomNumber() != null) {
            existing.setRoomNumber(updatedStudent.getRoomNumber());
        }
        if (updatedStudent.getDateInDorm() != null) {
            existing.setDateInDorm(updatedStudent.getDateInDorm());
        }
        if (updatedStudent.getIsForeign() != null) {
            existing.setIsForeign(updatedStudent.getIsForeign());
        }
        if (updatedStudent.getNotes() != null) {
            existing.setNotes(updatedStudent.getNotes());
        }

        return studentRepository.save(existing);
    }

    public void deleteStudent(String isu) {
        if (!studentRepository.existsById(isu)) {
            throw new IllegalArgumentException(
                    "Студент не найден: " + isu
            );
        }

        studentRepository.deleteById(isu);
    }
}
