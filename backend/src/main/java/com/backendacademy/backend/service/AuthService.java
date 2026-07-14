package com.backendacademy.backend.service;

import com.backendacademy.backend.exception.EmailAlreadyExistsException;
import com.backendacademy.backend.exception.InvalidRefreshTokenException;
import com.backendacademy.backend.model.RefreshToken;
import com.backendacademy.backend.model.Role;
import com.backendacademy.backend.model.User;
import com.backendacademy.backend.model.dto.*;
import com.backendacademy.backend.repository.RefreshTokenRepository;
import com.backendacademy.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse registerStudent(StudentRegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email is already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.STUDENT)
                .experienceLevel(request.getExperienceLevel())
                .faculty(request.getFaculty())
                .build();

        User savedUser = userRepository.save(user);
        String accessToken = jwtService.generateToken(savedUser);
        RefreshToken refreshToken = createRefreshToken(savedUser);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .user(mapToUserDto(savedUser))
                .build();
    }

    @Transactional
    public AuthResponse registerInstructor(InstructorRegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email is already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.INSTRUCTOR)
                .credentials(request.getCredentials())
                .bio(request.getBio())
                .build();

        User savedUser = userRepository.save(user);
        String accessToken = jwtService.generateToken(savedUser);
        RefreshToken refreshToken = createRefreshToken(savedUser);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .user(mapToUserDto(savedUser))
                .build();
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        // This will authenticate user and throw BadCredentialsException if invalid
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidRefreshTokenException("User not found"));

        // Revoke active old refresh tokens to enhance security
        revokeAllUserRefreshTokens(user);

        String accessToken = jwtService.generateToken(user);
        RefreshToken refreshToken = createRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .user(mapToUserDto(user))
                .build();
    }

    @Transactional
    public RefreshResponse refreshToken(RefreshRequest request) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new InvalidRefreshTokenException("Invalid refresh token"));

        if (refreshToken.isRevoked() || refreshToken.getExpiryDate().isBefore(Instant.now())) {
            throw new InvalidRefreshTokenException("Refresh token is expired or revoked");
        }

        User user = refreshToken.getUser();
        String accessToken = jwtService.generateToken(user);

        return new RefreshResponse(accessToken);
    }

    public UserDto getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new InvalidRefreshTokenException("User is not authenticated");
        }

        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidRefreshTokenException("User not found"));

        return mapToUserDto(user);
    }

    private RefreshToken createRefreshToken(User user) {
        RefreshToken refreshToken = RefreshToken.builder()
                .token(UUID.randomUUID().toString())
                .user(user)
                .expiryDate(Instant.now().plus(7, ChronoUnit.DAYS))
                .revoked(false)
                .build();

        return refreshTokenRepository.save(refreshToken);
    }

    private void revokeAllUserRefreshTokens(User user) {
        List<RefreshToken> activeTokens = refreshTokenRepository.findByUserAndRevokedFalse(user);
        if (!activeTokens.isEmpty()) {
            activeTokens.forEach(token -> token.setRevoked(true));
            refreshTokenRepository.saveAll(activeTokens);
        }
    }

    private UserDto mapToUserDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
}
