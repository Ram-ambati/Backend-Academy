package com.backendacademy.backend.controller;

import com.backendacademy.backend.service.AiLearningService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/ai")
public class AiController {

    private final AiLearningService aiLearningService;

    @Autowired
    public AiController(AiLearningService aiLearningService) {
        this.aiLearningService = aiLearningService;
    }

    public static class MessageDTO {
        private String role;
        private String content;

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
    }

    public static class AskRequest {
        private String question;
        private Long courseId;
        private String lessonTitle;
        private java.util.List<MessageDTO> history;

        public String getQuestion() { return question; }
        public void setQuestion(String question) { this.question = question; }
        public Long getCourseId() { return courseId; }
        public void setCourseId(Long courseId) { this.courseId = courseId; }
        public String getLessonTitle() { return lessonTitle; }
        public void setLessonTitle(String lessonTitle) { this.lessonTitle = lessonTitle; }
        public java.util.List<MessageDTO> getHistory() { return history; }
        public void setHistory(java.util.List<MessageDTO> history) { this.history = history; }
    }

    @PostMapping("/ask")
    public ResponseEntity<?> askQuestion(@RequestBody AskRequest request) {
        try {
            Map<String, String> response = aiLearningService.askQuestion(request.getQuestion(), request.getCourseId(), request.getLessonTitle(), request.getHistory());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/embed-all")
    public ResponseEntity<?> embedAllLessons() {
        try {
            aiLearningService.embedAllLessons();
            return ResponseEntity.ok(Map.of("message", "Successfully embedded all lessons into VectorStore."));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}
