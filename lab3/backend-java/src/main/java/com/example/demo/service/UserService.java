package com.example.demo.service;

import com.example.demo.dto.CreateUserRequest;
import com.example.demo.dto.UserResponse;
import com.example.demo.model.User;
import com.example.demo.model.Role;
import com.example.demo.exception.DuplicateLoginException;
import com.example.demo.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponse create(CreateUserRequest request) {
        
        if (userRepository.existsByLogin(request.login())) {
            throw new DuplicateLoginException(request.login());
        }

        String passwordHash = passwordEncoder.encode(request.password());

        User user = new User();
        user.setName(request.name());
        user.setLogin(request.login());
        user.setRole(Role.USER);
        user.setPasswordHash(passwordHash);

        User saveUser = userRepository.save(user);

        return new UserResponse(
            saveUser.getId(),
            saveUser.getName(),
            saveUser.getLogin(),
            saveUser.getRole()
        );
    }

}
