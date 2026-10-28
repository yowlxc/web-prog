package com.example.demo.controller;

import com.example.demo.exception.GlobalExceptionHandler;
import com.example.demo.repository.StudentRepository;
import com.example.demo.service.StudentService;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class StudentControllerTest {

    @Test
    void duplicateIsuReturnsConflict() throws Exception {
        StudentRepository repository = mock(StudentRepository.class);
        when(repository.existsById(123456)).thenReturn(true);
        MockMvc mvc = MockMvcBuilders
            .standaloneSetup(new StudentController(new StudentService(repository)))
            .setControllerAdvice(new GlobalExceptionHandler())
            .build();

        mvc.perform(post("/api/students")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"isu":123456,"fio":"Иванов Иван","group":"P1234",
                     "dormNumber":1,"roomNumber":101,"dateInDorm":"2024-09-01",
                     "isForeign":false,"notes":""}
                    """))
            .andExpect(status().isConflict())
            .andExpect(jsonPath("$.message").value("Студент с ИСУ 123456 уже существует"));
    }
}
