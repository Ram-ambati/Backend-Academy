package com.backendacademy.backend.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;

/**
 * Returns a clean JSON 403 response when an authenticated user
 * tries to access a resource their role doesn't permit.
 */
@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

    @Override
    public void handle(HttpServletRequest request,
                       HttpServletResponse response,
                       AccessDeniedException accessDeniedException) throws IOException {

        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");

        String json = """
                {
                  "success": false,
                  "message": "Forbidden — you do not have permission to access this resource",
                  "errorCode": "FORBIDDEN",
                  "timestamp": "%s"
                }
                """.formatted(LocalDateTime.now());

        response.getWriter().write(json);
    }
}
