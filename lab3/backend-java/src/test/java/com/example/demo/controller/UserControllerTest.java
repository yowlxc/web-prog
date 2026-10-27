package com.example.demo.controller;

import com.example.demo.exception.GlobalExceptionHandler;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class UserControllerTest {

    @Test
    void changeRoleIsForbiddenWithoutAuthentication() throws Exception {
        MockMvc mvc = MockMvcBuilders
            .standaloneSetup(new UserController(null))
            .setControllerAdvice(new GlobalExceptionHandler())
            .build();

        mvc.perform(patch("/api/users/1/role"))
            .andExpect(status().isForbidden());
    }
}
