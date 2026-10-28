package com.example.demo.config;

import com.example.demo.model.Role;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminInitializer implements CommandLineRunner {
    private static final Logger log = LoggerFactory.getLogger(AdminInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${ADMIN_LOGIN:}")
    private String login;

    @Value("${ADMIN_NAME:}")
    private String name;

    @Value("${ADMIN_PASSWORD:}")
    private String password;

    public AdminInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (login.isBlank() || name.isBlank() || password.isBlank()) {
            log.warn("Администратор не создан: задайте ADMIN_LOGIN, ADMIN_NAME и ADMIN_PASSWORD");
            return;
        }
        if (userRepository.existsByLogin(login)) {
            log.info("Пользователь с ADMIN_LOGIN уже существует");
            return;
        }
        User admin = new User();
        admin.setName(name);
        admin.setLogin(login);
        admin.setPasswordHash(passwordEncoder.encode(password));
        admin.setRole(Role.ADMIN);
        userRepository.save(admin);
        log.info("Администратор создан");
    }
}
