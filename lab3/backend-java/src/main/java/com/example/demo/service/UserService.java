package com.example.demo.service;

import com.example.demo.dto.CreateUserRequest;
import com.example.demo.dto.UserResponse;
import com.example.demo.model.User;
import com.example.demo.model.Role;
import com.example.demo.exception.DuplicateLoginException;
import com.example.demo.exception.UserNotFoundException;
import com.example.demo.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Service
public class UserService {
    private static final Logger log = LoggerFactory.getLogger(UserService.class);

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
        log.info("Пользователь зарегистрирован: id={}", saveUser.getId());

        return new UserResponse(
            saveUser.getId(),
            saveUser.getName(),
            saveUser.getLogin(),
            saveUser.getRole()
        );
    }

    public UserResponse changeRole(Long id, Role role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
        user.setRole(role);
        User saved = userRepository.save(user);
        log.info("Роль пользователя id={} изменена на {}", id, role);
        return new UserResponse(saved.getId(), saved.getName(), saved.getLogin(), saved.getRole());
    }

}
