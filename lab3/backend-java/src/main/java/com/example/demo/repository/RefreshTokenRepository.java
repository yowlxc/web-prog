package com.example.demo.repository;

import com.example.demo.model.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    @Query("""
    select t from RefreshToken t
    join fetch t.user
    where t.tokenHash = :tokenHash
    """)
    Optional<RefreshToken> findByTokenHash(String tokenHash);

    @Modifying
    @Query("""
        delete from RefreshToken t
        where t.id = :id and t.tokenHash = :tokenHash
        """)
    int consume(@Param("id") Long id, @Param("tokenHash") String tokenHash);

    @Modifying
    @Query("delete from RefreshToken t where t.tokenHash = :tokenHash")
    int revokeByTokenHash(@Param("tokenHash") String tokenHash);
}