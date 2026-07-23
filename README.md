# Backend Academy

**Backend Academy** is an AI-powered learning platform designed to teach modern Java backend development through structured, project-based learning.

Unlike traditional platforms that only provide videos and notes, Backend Academy combines:
- guided weekly modules,
- practical coding assignments,
- secure RESTful backend architecture,
- and an intelligent lesson-aware AI assistant.

The goal is to help learners build real-world backend engineering skills while progressing through an industry-focused curriculum.

---

## Abstract

Backend Academy organizes learning into weekly milestones where students move from core backend fundamentals to advanced production topics. Learners study concepts and apply them directly by building software features, APIs, and secure systems.

The integrated AI assistant is context-aware: it understands the lesson a student is currently viewing and provides targeted support such as explanations, code walkthroughs, quiz questions, interview prep, and debugging help.

With Retrieval-Augmented Generation (RAG), responses are grounded in the platform's own lesson content, code snippets, and resources to keep answers relevant, consistent, and educational.

---

## Core Features (Project Modules)

### 1) User Management
- [x] Student registration
- [x] Instructor registration
- [ ] Administrator management
- [ ] User profiles
- [ ] Account management
- [ ] Progress tracking

### 2) Authentication & Authorization
Protect all resources in the application.
**Roles:** Admin, Instructor, Student
- [x] Login / Logout
- [x] JWT authentication
- [x] Password encryption
- [x] Role-based authorization
- [x] Protected endpoints

### 3) Course Management
Organize and manage learning content.
- [x] Create, update, delete courses
- [x] Publish courses
- [ ] Course categories (Spring Boot, REST APIs, Security, Docker, etc.)

### 4) Weekly Learning Modules
Structured progression model: `Course -> Week -> Lesson -> Assignment -> Quiz`
- [ ] Learning objectives
- [ ] Lesson notes
- [ ] Code snippets
- [ ] Resources
- [ ] Assignments

### 5) Lesson Viewer (Core Experience)
- [ ] Title
- [ ] Optional embedded YouTube video (URL-based, lightweight storage)
- [ ] Markdown notes
- [ ] Java code examples
- [ ] Resources
- [ ] Navigation
- [ ] Assignment
- [ ] AI assistant

### 6) AI Learning Assistant
Context-aware lesson support (not a generic chatbot). Students can ask:
- [ ] Explain this topic
- [ ] Explain this code
- [ ] Give another example
- [ ] Quiz me
- [ ] Generate interview questions
- [ ] Simplify this concept
- [ ] Debug my code

### 7) Retrieval-Augmented Generation (RAG)
Before calling the LLM, the platform retrieves:
- [ ] Current lesson context
- [ ] Markdown notes
- [ ] Code examples
- [ ] Resources

### 8) Code Snippet Library
Every lesson includes executable backend examples:
- [ ] `@RestController`
- [ ] `@GetMapping`
- [ ] `@Service`
- [ ] `@Repository`
- [ ] Entity mapping examples
- [ ] JWT and Spring Security examples

### 9) Assignment System
Hands-on practice after every lesson:
- [ ] Mini challenge
- [ ] Assignment task
- [ ] Expected output
- [ ] Optional reference solution

### 10) Progress Tracking
Track learning outcomes in real time.
- [ ] Completed lessons
- [ ] Weekly progress
- [ ] Overall course progress

### 11) Performance Optimization
- [ ] Caching
- [ ] Async processing
- [ ] Structured logging
- [ ] Monitoring with Actuator

### 12) Testing
- [x] Unit testing
- [x] Integration testing
- [ ] API testing

### 13) Documentation
- [x] Swagger / OpenAPI
- [x] API documentation
- [x] Professional README practices

### 14) Deployment
- [ ] Docker
- [ ] Docker Compose
- [ ] Cloud deployment (Render / Railway)
- [ ] Frontend deployment (Vercel)

---

## Learning Objectives (Concepts Learned)

### User Management
- Entity design
- DTOs
- Validation
- Exception handling
- CRUD operations

### Authentication & Authorization
- Spring Security
- JWT
- BCrypt
- Authentication and authorization flow
- Security filters

### Course Management
- CRUD APIs
- Pagination
- Sorting
- Layered architecture

### Weekly Learning Modules
- Relational database design
- Entity relationships

### Lesson Viewer (Core Experience)
- Markdown rendering
- File organization
- Dynamic content loading

### AI Learning Assistant
- REST API integration
- WebClient / RestTemplate
- Prompt engineering
- LLM API integration

### Retrieval-Augmented Generation (RAG)
- Embeddings
- Vector databases
- Similarity search
- Context injection
- AI retrieval

### Code Snippet Library
- Code organization
- Markdown-based example delivery

### Assignment System
- Practical backend development workflow

### Progress Tracking
- User progress modeling
- Database update strategies

### Performance Optimization
- `@Cacheable`
- `@Async`
- Logback
- Spring Boot Actuator

### Testing
- JUnit
- Mockito
- Test-driven thinking

### Deployment
- Containerization
- Production deployment
- Environment variable management

---

## Technologies Covered

### Backend
- Java
- Spring Boot
- Spring MVC
- Spring Data JPA
- Spring Security
- JWT
- Hibernate

### Database
- PostgreSQL
- MySQL

### AI
- LLM APIs
- Retrieval-Augmented Generation (RAG)
- Embeddings
- Vector search

### Frontend (Minimal)
- React
- Vite
- Axios
- Markdown rendering

### DevOps & Deployment
- Docker
- Docker Compose
- Render
- Railway
- Vercel

---

## 🗂️ Project Issues Roadmap (Sprint Planning)

### 🏗️ Phase 1 — Foundation (10 Issues)
- [x] 1. Authentication API Contract (`/api/v1/auth/*`)
- [x] 2. User Role & Permission Matrix (RBAC — `Role` enum, `@PreAuthorize`)
- [x] 3. User Entity & Database Design (`User.java`, Flyway `V1`, `V2`)
- [x] 4. Course Entity & Database Design (`Course.java`, Flyway `V3`)
- [ ] 5. Lesson Entity & Database Design
- [ ] 6. Enrollment Entity & Progress Design
- [x] 7. API Response Standard (`PagedResponse<T>`, Raw DTO responses)
- [x] 8. Error Response Standard (`ErrorResponse`, `GlobalExceptionHandler`)
- [x] 9. API Naming & URL Convention Review (`/api/v1/*` RESTful standards)
- [x] 10. Swagger/OpenAPI Planning & Setup (`springdoc-openapi`, Swagger UI)

### 📚 Phase 2 — Course Module (6 Issues)
- [x] 11. Course CRUD Service & Controller (`CourseService`, ownership enforcement)
- [ ] 12. Lesson CRUD API
- [ ] 13. Course Search & Filtering
- [ ] 14. Pagination & Sorting
- [ ] 15. Markdown Lesson Format
- [ ] 16. Code Snippet & Resource Structure

### 🔐 Phase 3 — Authentication & Security (5 Issues)
- [x] 17. JWT Authentication Flow
- [x] 18. Spring Security Configuration Plan
- [x] 19. Protected Route Contract
- [x] 20. Refresh Token Strategy
- [ ] 21. Password Reset & Email Verification Flow

### 🤖 Phase 4 — AI Module (5 Issues)
- [ ] 22. AI Chat API
- [ ] 23. RAG Context Flow
- [ ] 24. Conversation History
- [ ] 25. Prompt & Response Models
- [ ] 26. AI Error Handling & Rate Limits

### 👤 Phase 5 — User Experience (5 Issues)
- [ ] 27. Dashboard API
- [ ] 28. User Profile API
- [ ] 29. Progress Tracking API
- [ ] 30. Notifications API
- [ ] 31. Search API

### 🚀 Phase 6 — Platform (5 Issues)
- [ ] 32. Health & Version Endpoints
- [ ] 33. File Upload API
- [ ] 34. Deployment Configuration
- [ ] 35. API Documentation Review



---

## Tags / Keywords

`Java` `Spring Boot` `Backend Development` `REST API` `JWT` `Spring Security` `JPA` `Hibernate` `PostgreSQL` `MySQL` `AI Assistant` `LLM` `RAG` `Embeddings` `Vector Search` `EdTech` `Project-Based Learning` `Docker` `Microservices Concepts` `API Testing`

