package com.example.demo.repository;

import com.example.demo.model.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface RefreshTokenRepository
        extends JpaRepository<RefreshToken, Long> {

    @Query("SELECT t FROM RefreshToken t JOIN FETCH t.user WHERE t.tokenHash = :tokenHash")
    Optional<RefreshToken> findByTokenHash(
            @Param("tokenHash") String tokenHash
    );

    @Modifying
    @Query("DELETE FROM RefreshToken t WHERE t.id = :id AND t.tokenHash = :tokenHash")
    int consume(
            @Param("id") Long id,
            @Param("tokenHash") String tokenHash
    );

    @Modifying
    @Query("DELETE FROM RefreshToken t WHERE t.tokenHash = :tokenHash")
    int revokeByTokenHash(
            @Param("tokenHash") String tokenHash
    );
}
