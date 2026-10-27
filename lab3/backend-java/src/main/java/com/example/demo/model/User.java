package com.example.demo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import com.example.demo.model.Role;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 30)
    private String name;

    @Column(name = "login", nullable = false, unique = true, length = 30)
    private String login;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 7)
    private Role role;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;
    

    public User() {}

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    
    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }


}
