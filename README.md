# 🎓 Backend Academy

![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.1.0-brightgreen.svg?logo=springboot)
![React](https://img.shields.io/badge/React-18-blue.svg?logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg?logo=postgresql)
![AI Enabled](https://img.shields.io/badge/AI-Gemini%20%7C%20Groq-orange)

**Backend Academy** is a modern, AI-powered learning platform designed specifically to teach backend development through structured, project-based learning.

Unlike traditional platforms that rely solely on passive video lectures, Backend Academy combines guided weekly modules, practical coding assignments, secure RESTful architecture, and a **context-aware AI Tutor** that helps students understand concepts from first principles.

---

## ✨ Key Features

- 🔐 **Robust Authentication & RBAC**: Secure JWT-based authentication with role-based access control (Admin, Instructor, Student) powered by Spring Security.
- 📚 **Structured Learning Modules**: Courses organized into weekly modules containing rich Markdown-based lessons, embedded video support, and executable Java code snippets.
- 🤖 **Integrated AI Tutor**: A built-in AI assistant powered by Spring AI (Gemini primary, Groq fallback) that understands the context of the platform and helps students debug, learn, and test their knowledge.
- 📈 **Progress Tracking**: Real-time tracking of completed lessons and overall course progress for students.
- 🎨 **Modern Interface**: A sleek, responsive frontend built with React, featuring a Swayam-inspired UI, smooth animations, and a distraction-free learning environment.
- 🗄️ **Production-Ready Data Layer**: Powered by PostgreSQL, managed by Flyway migrations, and optimized with Spring Data JPA.

---

## 🛠️ Technology Stack

### Backend
- **Java 21** & **Spring Boot 4.1.0**
- **Spring Security** & **JWT** for Authentication
- **Spring Data JPA** & **Hibernate**
- **Spring AI** (Integrating OpenAI-compatible endpoints for Gemini/Groq)
- **Flyway** for Database Migrations
- **PostgreSQL** (Hosted on Supabase)

### Frontend
- **React 18** (Vite)
- **React Router DOM**
- **Zustand** (State Management)
- **Vanilla CSS** (Custom Design System with Glassmorphism)
- **Lucide React** (Icons)
- **React Markdown** & **SyntaxHighlighter**

---

## 🚀 Getting Started

### Prerequisites
- **Java 21** installed
- **Node.js 18+** installed
- **PostgreSQL** database (Local or Supabase)
- **Gemini API Key** or **Groq API Key** (for the AI Tutor)

### 1. Clone the Repository
```bash
git clone https://github.com/Ram-ambati/Backend-Academy.git
cd Backend-Academy
```

### 2. Backend Setup
Navigate to the `backend` directory and set up your environment variables.

Create a `.env` file in the `backend` directory:
```env
SPRING_DATASOURCE_URL=jdbc:postgresql://<your-db-url>:5432/postgres
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=your_password
JWT_SECRET=your_super_secret_jwt_key_that_is_at_least_256_bits
ADMIN_EMAIL=admin@backendacademy.com
ADMIN_PASSWORD_HASH=$2a$10$vI8aWNnFlbAaDBbrkwspiuZ.5uQ.fU8YgYQeG.8Qh2j/UxgkKx83m

# AI Configuration (Provide at least one)
GEMINI_API_KEY=your_gemini_key
GROQ_API_KEY=your_groq_key
```

Run the Spring Boot application:
```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```
*Note: The `dev` profile automatically runs the `DatabaseSeeder` to populate initial admin accounts and sample courses.*

### 3. Frontend Setup
Navigate to the `frontend` directory:
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:
```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

Start the Vite development server:
```bash
npm run dev
```

---

## 🏗️ Architecture & Roadmap

Backend Academy is built using a strict layered monolithic architecture (Controller -> Service -> Repository).

**Completed Features (Phase 2):**
- **PgVector RAG Implementation**: Enhancing the AI Tutor with Retrieval-Augmented Generation using local ONNX embeddings (`all-MiniLM-L6-v2`) and PostgreSQL's vector extension to query actual lesson content.

**Upcoming Features (Phase 3):**
- **Interactive Assignments**: Hands-on coding challenges with expected outputs and reference solutions.
- **Instructor Dashboard**: Advanced analytics and course creation tools for educators.

---

## 🚀 Deployment

The project is configured for a modern cloud deployment architecture:

### Frontend (Vercel)
The React SPA is optimized for Vercel deployment.
1. Connect your GitHub repository to Vercel.
2. Select the `frontend` root directory and the Vite framework preset.
3. Add the `VITE_API_URL` environment variable pointing to your backend URL.

### Backend (Render)
The Spring Boot application includes a multi-stage `Dockerfile` optimized for Render.
1. Create a new Web Service on Render and connect your repository.
2. Select `Docker` as the environment and `./backend` as the Root Directory.
3. Configure your environment variables (Database credentials, JWT secret, AI API keys).
4. Render will automatically map the `PORT` variable to the Spring Boot application.

---

## 📝 License
This project is proprietary and built for educational purposes. All rights reserved.
