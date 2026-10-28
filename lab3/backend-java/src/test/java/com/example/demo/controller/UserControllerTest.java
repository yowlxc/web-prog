package com.example.demo.controller;

import com.example.demo.exception.GlobalExceptionHandler;
import com.example.demo.service.UserService;
import com.example.demo.dto.UserResponse;
import com.example.demo.model.Role;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.http.MediaType;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class UserControllerTest {

    @Test
    void changeRoleUpdatesUser() throws Exception {
        UserService userService = mock(UserService.class);
        when(userService.changeRole(1L, Role.ADMIN))
                .thenReturn(new UserResponse(1L, "Ivan", "ivan", Role.ADMIN));
        MockMvc mvc = MockMvcBuilders
            .standaloneSetup(new UserController(userService))
            .setControllerAdvice(new GlobalExceptionHandler())
            .build();

        mvc.perform(patch("/api/users/1/role")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"role\":\"ADMIN\"}"))
            .andExpect(status().isOk());
    }
}
