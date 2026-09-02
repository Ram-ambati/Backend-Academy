package com.backendacademy.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AiLearningService {

    private static final Logger logger = LoggerFactory.getLogger(AiLearningService.class);

    // Auto-configured by Spring AI using application.properties (Gemini)
    @Autowired(required = false)
    private OpenAiChatModel geminiChatModel;

    @Autowired(required = false)
    private org.springframework.ai.vectorstore.VectorStore vectorStore;

    @Value("${app.ai.groq.api-key:}")
    private String groqApiKey;

    @Autowired
    private com.backendacademy.backend.repository.LessonRepository lessonRepository;

    @Autowired
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Phase 1: Simple chat with fallback.
     * Phase 2: Will receive 'context' from a vector similarity search before calling the model.
     */
    public Map<String, String> askQuestion(String question, Long courseId, String lessonTitle, java.util.List<com.backendacademy.backend.controller.AiController.MessageDTO> history) {
        String context = "";
        
        String finalPromptText = question;
        if (lessonTitle != null && !lessonTitle.trim().isEmpty()) {
            finalPromptText = "The user is currently viewing the lesson: '" + lessonTitle + "'.\n" + finalPromptText;
        }
        
        if (vectorStore != null) {
            try {
                logger.info("Performing similarity search for context...");
                org.springframework.ai.vectorstore.SearchRequest.Builder searchRequestBuilder = org.springframework.ai.vectorstore.SearchRequest.builder().query(question).topK(3);
                if (courseId != null) {
                    searchRequestBuilder = searchRequestBuilder.filterExpression("courseId == " + courseId);
                }
                List<org.springframework.ai.document.Document> similarDocs = vectorStore.similaritySearch(searchRequestBuilder.build());
                if (similarDocs != null && !similarDocs.isEmpty()) {
                    StringBuilder contextBuilder = new StringBuilder();
                    for (org.springframework.ai.document.Document doc : similarDocs) {
                        contextBuilder.append(doc.getText()).append("\n\n");
                    }
                    context = contextBuilder.toString().trim();
                    logger.info("Found {} relevant documents for context.", similarDocs.size());
                } else {
                    logger.info("No relevant documents found in VectorStore.");
                }
            } catch (Exception e) {
                logger.error("Failed to query VectorStore. Error: {}", e.getMessage());
            }
        } else {
            logger.warn("VectorStore is null. RAG is disabled.");
        }
        
        if (!context.isEmpty()) {
            finalPromptText = "Context:\n" + context + "\n\nUser Question:\n" + finalPromptText;
        }

        String systemPrompt = "You are Nexus AI Tutor, an expert educational assistant exclusively for Backend Academy.\n\n" +
                "IDENTITY:\n" +
                "- You must never identify yourself as Gemini, ChatGPT, or any other LLM. You are Nexus AI Tutor.\n" +
                "- Tone: Helpful, educational, strictly professional, and encouraging.\n\n" +
                "DOMAIN CONSTRAINTS (CRITICAL):\n" +
                "- Your SOLE domain is backend development, computer science, software architecture, and programming.\n" +
                "- You MUST NOT answer questions, give advice, or engage in discussions outside of this domain (e.g., aviation, cooking, medical, general trivia).\n\n" +
                "REJECTION PROTOCOL:\n" +
                "- If a user asks an out-of-domain question, you must politely decline and pivot back to backend engineering.\n" +
                "- Example Rejection: \"I am specialized in backend development for Backend Academy and cannot assist with that. Let's get back to your code!\"";

        try {
            if (geminiChatModel != null) {
                logger.info("Attempting to use Gemini (Primary)...");
                List<org.springframework.ai.chat.messages.Message> messages = new java.util.ArrayList<>();
                messages.add(new org.springframework.ai.chat.messages.SystemMessage(systemPrompt));
                
                if (history != null) {
                    for (com.backendacademy.backend.controller.AiController.MessageDTO msg : history) {
                        if ("user".equalsIgnoreCase(msg.getRole())) {
                            messages.add(new org.springframework.ai.chat.messages.UserMessage(msg.getContent()));
                        } else {
                            messages.add(new org.springframework.ai.chat.messages.AssistantMessage(msg.getContent()));
                        }
                    }
                }
                
                messages.add(new org.springframework.ai.chat.messages.UserMessage(finalPromptText));
                Prompt prompt = new Prompt(messages);
                
                String answer = geminiChatModel.call(prompt).getResult().getOutput().getText();
                return buildResponse(answer, "gemini");
            } else {
                logger.warn("Gemini ChatModel is null (missing API key?)");
            }
        } catch (Exception e) {
            logger.warn("Gemini API failed. Falling back to Groq. Error: {}", e.getMessage());
        }

        try {
            if (groqApiKey != null && !groqApiKey.trim().isEmpty()) {
                logger.info("Attempting to use Groq (Fallback)...");
                String answer = callGroqFallback(systemPrompt, finalPromptText, history);
                return buildResponse(answer, "groq");
            } else {
                logger.warn("Groq API key is missing. Cannot fallback.");
            }
        } catch (Exception e) {
            logger.error("Groq API also failed. Error: {}", e.getMessage());
        }

        throw new RuntimeException("All AI providers failed or are not configured.");
    }

    private String callGroqFallback(String systemPrompt, String promptText, java.util.List<com.backendacademy.backend.controller.AiController.MessageDTO> history) {
        String url = "https://api.groq.com/openai/v1/chat/completions";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(groqApiKey);

        List<Map<String, Object>> messages = new java.util.ArrayList<>();
        
        Map<String, Object> sysMessage = new HashMap<>();
        sysMessage.put("role", "system");
        sysMessage.put("content", systemPrompt);
        messages.add(sysMessage);
        
        if (history != null) {
            for (com.backendacademy.backend.controller.AiController.MessageDTO msg : history) {
                Map<String, Object> m = new HashMap<>();
                m.put("role", "ai".equalsIgnoreCase(msg.getRole()) ? "assistant" : "user");
                m.put("content", msg.getContent());
                messages.add(m);
            }
        }

        Map<String, Object> userMessage = new HashMap<>();
        userMessage.put("role", "user");
        userMessage.put("content", promptText);
        messages.add(userMessage);

        Map<String, Object> body = new HashMap<>();
        body.put("model", "openai/gpt-oss-120b");
        body.put("messages", messages);
        body.put("temperature", 0.7);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        
        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url, 
                HttpMethod.POST, 
                request, 
                new ParameterizedTypeReference<Map<String, Object>>() {}
        );
        
        if (response.getBody() != null) {
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
            if (choices != null && !choices.isEmpty()) {
                Map<String, Object> firstChoice = choices.get(0);
                @SuppressWarnings("unchecked")
                Map<String, Object> messageObj = (Map<String, Object>) firstChoice.get("message");
                if (messageObj != null) {
                    return (String) messageObj.get("content");
                }
            }
        }
        throw new RuntimeException("Empty response from Groq");
    }

    private Map<String, String> buildResponse(String answer, String model) {
        Map<String, String> response = new HashMap<>();
        response.put("answer", answer);
        response.put("model", model);
        return response;
    }

    public void embedAllLessons() {
        if (vectorStore == null) {
            logger.warn("VectorStore is not configured, skipping embedding.");
            return;
        }
        List<com.backendacademy.backend.model.Lesson> lessons = lessonRepository.findAll();
        logger.info("Embedding {} lessons into VectorStore...", lessons.size());
        for (com.backendacademy.backend.model.Lesson lesson : lessons) {
            embedLesson(lesson);
        }
        logger.info("Finished embedding {} lessons.", lessons.size());
    }

    public void embedLesson(com.backendacademy.backend.model.Lesson lesson) {
        if (vectorStore == null) return;
        if (lesson.getContent() == null || lesson.getContent().trim().isEmpty()) return;
        
        String[] chunks = lesson.getContent().split("\\n\\s*\\n");
        List<org.springframework.ai.document.Document> docs = new java.util.ArrayList<>();
        for (int i = 0; i < chunks.length; i++) {
            String chunk = chunks[i].trim();
            if (chunk.isEmpty()) continue;
            
            String contentToEmbed = "Lesson Title: " + lesson.getTitle() + "\n\n" + chunk;
            Map<String, Object> metadata = new java.util.HashMap<>();
            metadata.put("lessonId", lesson.getId());
            metadata.put("courseId", lesson.getCourse().getId());
            metadata.put("title", lesson.getTitle());
            metadata.put("chunkIndex", i);
            
            docs.add(new org.springframework.ai.document.Document(contentToEmbed, metadata));
        }
        if (!docs.isEmpty()) {
            vectorStore.add(docs);
        }
    }

    public void deleteLessonEmbeddings(Long lessonId) {
        if (vectorStore == null) return;
        try {
            int deleted = jdbcTemplate.update("DELETE FROM vector_store WHERE metadata->>'lessonId' = ?", String.valueOf(lessonId));
            logger.info("Deleted {} vector chunks for lessonId={}", deleted, lessonId);
        } catch (Exception e) {
            logger.warn("Failed to delete vectors for lessonId={}: {}", lessonId, e.getMessage());
        }
    }
}
