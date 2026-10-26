package com.example.demo.controller;

import jakarta.validation.Valid;
import com.example.demo.model.Student;
import com.example.demo.service.StudentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {
    "http://127.0.0.1:5500",
    "http://localhost:5500"
}) 

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    // получить список студентов (с фильтрами)
    @GetMapping
    public List<Student> getAllStudents(
            @RequestParam(required = false) Integer roomMin,
            @RequestParam(required = false) Integer roomMax,
            @RequestParam(required = false) String group,
            @RequestParam(required = false) String fio,
            @RequestParam(required = false) Integer dormNumber,
            @RequestParam(required = false) Boolean isForeign) {

        if (roomMin == null && roomMax == null && group == null
                && fio == null && dormNumber == null && isForeign == null) {
            return studentService.getAllStudents();
        }

        return studentService.filterStudents(
                roomMin, roomMax, group, fio, dormNumber, isForeign);
    }

    // получить студента по ИСУ
    @GetMapping("/{isu}")
    public ResponseEntity<Student> getStudentByIsu(
            @PathVariable String isu) {
        return studentService.getStudentByIsu(isu)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // создать студента
    @PostMapping
    public ResponseEntity<Student> createStudent(
            @Valid @RequestBody Student student) {
        Student created = studentService.createStudent(student);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // частично обновить студента
    @PatchMapping("/{isu}")
    public ResponseEntity<Student> updateStudent(
            @PathVariable String isu,
            @RequestBody Student student) {
        return ResponseEntity.ok(
                studentService.updateStudent(isu, student));
    }

    // удалить студента
    @DeleteMapping("/{isu}")
    public ResponseEntity<Void> deleteStudent(
            @PathVariable String isu) {
        studentService.deleteStudent(isu);
        return ResponseEntity.noContent().build();
    }
}
