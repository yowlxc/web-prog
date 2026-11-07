package com.example.demo.repository;

import com.example.demo.model.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface RefreshTokenRepository
        extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByTokenHash(String tokenHash);

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

/*
        Я использую RefreshTokenRepository как интерфейс,
        потому что Spring Data JPA автоматически создаёт
        его реализацию. Стандартные методы предоставляются 
        JpaRepository, дополнительные запросы Spring
        формирует по названию метода или по аннотации
        @Query. Поэтому писать отдельный класс с implements
        не требуется. При необходимости я могу реализовать
        тот же интерфейс вручную через EntityManager.
*/


// // repository/RefreshTokenRepository.java
// package com.example.demo.repository;

// import com.example.demo.model.RefreshToken;
// import java.util.Optional;

// public interface RefreshTokenRepository {

//     Optional<RefreshToken> findByTokenHash(String tokenHash);

//     int consume(Long id, String tokenHash);

//     int revokeByTokenHash(String tokenHash);
// }

// // repository/RefreshTokenRepositoryImpl.java
// package com.example.demo.repository;

// import com.example.demo.model.RefreshToken;
// import jakarta.persistence.EntityManager;
// import jakarta.persistence.NoResultException;
// import org.springframework.stereotype.Repository;
// import org.springframework.transaction.annotation.Transactional;

// import java.util.Optional;

// @Repository
// public class RefreshTokenRepositoryImpl
//         implements RefreshTokenRepository {

//     private final EntityManager entityManager;

//     public RefreshTokenRepositoryImpl(EntityManager entityManager) {
//         this.entityManager = entityManager;
//     }

//     @Override
//     public Optional<RefreshToken> findByTokenHash(String tokenHash) {
//         try {
//             RefreshToken token = entityManager.createQuery(
//                     "SELECT t FROM RefreshToken t WHERE t.tokenHash = :hash",
//                     RefreshToken.class
//                 )
//                 .setParameter("hash", tokenHash)
//                 .getSingleResult();

//             return Optional.of(token);
//         } catch (NoResultException e) {
//             return Optional.empty();
//         }
//     }

//     @Override
//     @Transactional
//     public int consume(Long id, String tokenHash) {
//         return entityManager.createQuery(
//                 "DELETE FROM RefreshToken t " +
//                 "WHERE t.id = :id AND t.tokenHash = :hash"
//             )
//             .setParameter("id", id)
//             .setParameter("hash", tokenHash)
//             .executeUpdate();
//     }

//     @Override
//     @Transactional
//     public int revokeByTokenHash(String tokenHash) {
//         return entityManager.createQuery(
//                 "DELETE FROM RefreshToken t WHERE t.tokenHash = :hash"
//             )
//             .setParameter("hash", tokenHash)
//             .executeUpdate();
//     }
// }
