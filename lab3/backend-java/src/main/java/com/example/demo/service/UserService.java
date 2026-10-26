package com.example.demo.service;

import com.example.demo.dto.CreateUserRequest;
import com.example.demo.dto.UserResponse;
import com.example.demo.entity.User;
import com.example.demo.entity.Role;
import com.example.demo.exception.DuplicateLoginException;
import com.example.demo.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserResponse(
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

        String passwordHash = passwordEncoder.encode(request.password())

        User user - new User();
        user.setName(request.name());
        user.setLogin(request.login());
        user.setRole(request.role())
        user.setPasswordHash(passwordHash);

        User saveUser = UserRepository.save(user);

        return new UserResponse(
            saveUser.getId(),
            saveUser.getName(),
            saveUser.getLogin(),
            saveUser.getRole()
        )
    }

    public UserRepository changeRole(Long id) {

        User nowUser = userRepository.findById(id)
            .orElseThrow(() -> throw new UserNotFoundException(id));

        if (nowUser.getRole() == Role.USER ) {
            nowUser.setRole(Role.ADMIN);
        }
        else {
            nowUser.setRole(Role.USER);
        }
        
        return userRepository.save(nowUser);
    }

    public boolean isAdmin(Long id) {
        User nowUser = userRepository.findById(id)
            .orElseThrow(() -> throw new UserNotFoundException(id));

        if (nowUser.role() == Role.ADMIN) {
            return True
        }
        else {
            return False
        }        
    }

    
}
