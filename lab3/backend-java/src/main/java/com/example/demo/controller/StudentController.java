package com.example.demo.controller;

import com.example.demo.dto.StudentPatchRequest;
import com.example.demo.dto.StudentRequest;
import com.example.demo.dto.StudentResponse;
import com.example.demo.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping
    public List<StudentResponse> getAllStudents(
            @RequestParam(required = false) Integer roomMin,
            @RequestParam(required = false) Integer roomMax,
            @RequestParam(required = false) String group,
            @RequestParam(required = false) Integer isu,
            @RequestParam(required = false) String fio,
            @RequestParam(required = false) Integer dormNumber,
            @RequestParam(required = false) Boolean isForeign,
            @RequestParam(defaultValue = "isu") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "20") Integer size) {
        return studentService.getStudents(roomMin, roomMax, group, fio, isu,
                dormNumber, isForeign, sortBy, sortDir, page, size);
    }

    @GetMapping("/{isu}")
    public StudentResponse getStudentByIsu(@PathVariable Integer isu) {
        return studentService.getStudentByIsu(isu);
    }

    @PostMapping
    public ResponseEntity<StudentResponse> createStudent(@Valid @RequestBody StudentRequest student) {
        return ResponseEntity.status(HttpStatus.CREATED).body(studentService.createStudent(student));
    }

    @PutMapping("/{isu}")
    public StudentResponse replaceStudent(@PathVariable Integer isu,
                                          @Valid @RequestBody StudentRequest student) {
        return studentService.replaceStudent(isu, student);
    }

    @PatchMapping("/{isu}")
    public StudentResponse updateStudent(@PathVariable Integer isu,
                                         @Valid @RequestBody StudentPatchRequest student) {
        return studentService.updateStudent(isu, student);
    }

    @DeleteMapping("/{isu}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Integer isu) {
        studentService.deleteStudent(isu);
        return ResponseEntity.noContent().build();
    }
}
