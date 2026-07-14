package com.backendacademy.backend.repository;

import com.backendacademy.backend.model.RefreshToken;
import com.backendacademy.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    List<RefreshToken> findByUserAndRevokedFalse(User user);
    void deleteByUser(User user);
}
