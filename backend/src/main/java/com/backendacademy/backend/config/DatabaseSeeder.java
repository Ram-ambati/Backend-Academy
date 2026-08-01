package com.backendacademy.backend.config;

import com.backendacademy.backend.model.Course;
import com.backendacademy.backend.model.CourseStatus;
import com.backendacademy.backend.model.DifficultyLevel;
import com.backendacademy.backend.model.Lesson;
import com.backendacademy.backend.model.Role;
import com.backendacademy.backend.model.User;
import com.backendacademy.backend.repository.CourseRepository;
import com.backendacademy.backend.repository.LessonRepository;
import com.backendacademy.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Component
@Profile("dev")
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final PasswordEncoder passwordEncoder;
    private final JdbcTemplate jdbcTemplate;

    @Override
    @Transactional
    public void run(String... args) {
        String instructorEmail = "instructor@backendacademy.com";
        String studentEmail = "student@backendacademy.com";

        log.info("Wiping existing test data (excluding ADMIN)...");
        jdbcTemplate.execute("DELETE FROM completed_lessons");
        jdbcTemplate.execute("DELETE FROM enrollments");
        jdbcTemplate.execute("DELETE FROM lessons");
        jdbcTemplate.execute("DELETE FROM courses");
        jdbcTemplate.execute("DELETE FROM refresh_tokens");
        jdbcTemplate.execute("DELETE FROM users WHERE role != 'ADMIN'");

        log.info("Starting database seed process...");

        // 1. Seed Users
        User instructor = User.builder()
                .name("Jane Doe")
                .email(instructorEmail)
                .password(passwordEncoder.encode("password"))
                .role(Role.INSTRUCTOR)
                .build();
        instructor = userRepository.save(instructor);

        User student = User.builder()
                .name("John Smith")
                .email(studentEmail)
                .password(passwordEncoder.encode("password"))
                .role(Role.STUDENT)
                .build();
        userRepository.save(student);

        // 2. Seed Courses
        Course springCourse = createCourse("Mastering Spring Boot 3", "Comprehensive guide to building modern APIs.", "Backend", DifficultyLevel.INTERMEDIATE, "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800", instructor);
        Course reactCourse = createCourse("React 18 from Scratch", "Learn React hooks, state management, and more.", "Frontend", DifficultyLevel.BEGINNER, "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800", instructor);
        Course pythonCourse = createCourse("Machine Learning with Python", "Introduction to Pandas, NumPy, and Scikit-Learn.", "Data Science", DifficultyLevel.ADVANCED, "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800", instructor);

        courseRepository.saveAll(List.of(springCourse, reactCourse, pythonCourse));

        // 3. Seed Lessons for Spring Boot
        lessonRepository.saveAll(List.of(
                createLesson(springCourse, "Intro to Spring Boot", 
                        """
                        # 🚀 Welcome to Spring Boot
                        
                        In this lesson, we will cover the foundational concepts of Spring Boot. Spring Boot makes it easy to create stand-alone, production-grade Spring based Applications that you can "just run".
                        
                        ## 🌟 Key Concepts
                        
                        ### 1. Autoconfiguration
                        Spring Boot attempts to auto-configure your Spring application based on the jar dependencies that you have added. For example, if `HSQLDB` is on your classpath, and you have not manually configured any database connection beans, then Spring Boot auto-configures an in-memory database.
                        
                        ### 2. Starter Dependencies
                        Starters are a set of convenient dependency descriptors that you can include in your application. You get a one-stop shop for all the Spring and related technologies that you need.
                        
                        ## 💻 Your First Application
                        Here is what a basic Spring Boot application looks like:
                        
                        ```java
                        import org.springframework.boot.SpringApplication;
                        import org.springframework.boot.autoconfigure.SpringBootApplication;
                        
                        @SpringBootApplication
                        public class Application {
                            public static void main(String[] args) {
                                SpringApplication.run(Application.class, args);
                            }
                        }
                        ```
                        
                        > [!TIP]
                        > The `@SpringBootApplication` annotation is a convenience annotation that adds all of the following:
                        > - `@Configuration`
                        > - `@EnableAutoConfiguration`
                        > - `@ComponentScan`
                        """, 
                        "https://www.youtube.com/embed/9SGDpanrc8U", 1L),
                createLesson(springCourse, "Building REST APIs", 
                        """
                        # 🌐 Building REST APIs with Spring MVC
                        
                        Let's dive into building a robust REST API using `@RestController`.
                        
                        ## 📝 The Controller Layer
                        In a Spring application, the controller is responsible for handling incoming HTTP requests and returning the appropriate response.
                        
                        ### Example REST Controller
                        
                        ```java
                        @RestController
                        @RequestMapping("/api/v1/courses")
                        public class CourseController {
                        
                            private final CourseService courseService;
                        
                            public CourseController(CourseService courseService) {
                                this.courseService = courseService;
                            }
                        
                            @GetMapping
                            public ResponseEntity<List<Course>> getAllCourses() {
                                return ResponseEntity.ok(courseService.findAll());
                            }
                        
                            @PostMapping
                            public ResponseEntity<Course> createCourse(@RequestBody CourseDTO dto) {
                                return ResponseEntity.status(HttpStatus.CREATED).body(courseService.create(dto));
                            }
                        }
                        ```
                        
                        ### Core Annotations
                        - `@RestController`: Combines `@Controller` and `@ResponseBody`.
                        - `@GetMapping`: Maps HTTP GET requests onto specific handler methods.
                        - `@PostMapping`: Maps HTTP POST requests.
                        - `@RequestBody`: Binds the HTTP request body to a domain object.
                        """, 
                        "https://www.youtube.com/embed/9SGDpanrc8U", 2L),
                createLesson(springCourse, "Spring Security", 
                        """
                        # 🛡️ Spring Security Fundamentals
                        
                        Securing your application is critical. Spring Security provides comprehensive security services for Java EE-based enterprise software applications.
                        
                        ## 🔑 Authentication vs Authorization
                        
                        | Concept | Description |
                        |---------|-------------|
                        | **Authentication** | Verifying WHO the user is. (e.g., logging in with username/password) |
                        | **Authorization** | Verifying WHAT the user is allowed to do. (e.g., checking if a user has 'ADMIN' role) |
                        
                        ## 🎫 JWT Tokens (JSON Web Tokens)
                        In stateless REST APIs, we often use JWTs. A JWT contains a payload with claims about the user (like their user ID and roles), and is cryptographically signed.
                        
                        ```java
                        // Example snippet for verifying a JWT
                        public boolean validateToken(String token) {
                            try {
                                Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token);
                                return true;
                            } catch (JwtException | IllegalArgumentException e) {
                                return false;
                            }
                        }
                        ```
                        
                        > [!IMPORTANT]
                        > Never store sensitive information (like passwords) directly in the JWT payload, as it is only Base64 encoded and can be easily read by anyone.
                        """, 
                        "https://www.youtube.com/embed/9SGDpanrc8U", 3L)
        ));

        // Seed Lessons for React
        lessonRepository.saveAll(List.of(
                createLesson(reactCourse, "What is React?", 
                        """
                        # ⚛️ Introduction to React
                        
                        React is a declarative, efficient, and flexible JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called "components".
                        
                        ## 🏗️ Why React?
                        
                        | Feature | Description |
                        |---------|-------------|
                        | **Component-Based** | Build encapsulated components that manage their own state. |
                        | **Declarative** | React will efficiently update and render just the right components when your data changes. |
                        | **Learn Once, Write Anywhere** | Develop new features without rewriting existing code. |
                        
                        > [!TIP]
                        > React uses a Virtual DOM. Instead of interacting with the real DOM directly, React creates a lightweight copy in memory, making updates blazingly fast!
                        """, 
                        "https://www.youtube.com/embed/bMknfKXIFA8", 1L),
                createLesson(reactCourse, "React Hooks", 
                        """
                        # 🎣 Mastering React Hooks
                        
                        Hooks let you use state and other React features without writing a class.
                        
                        ## `useState`
                        The most fundamental hook is `useState`. It declares a "state variable".
                        
                        ```javascript
                        import React, { useState } from 'react';
                        
                        function Counter() {
                          const [count, setCount] = useState(0);
                        
                          return (
                            <div>
                              <p>You clicked {count} times</p>
                              <button onClick={() => setCount(count + 1)}>
                                Click me
                              </button>
                            </div>
                          );
                        }
                        ```
                        
                        > [!WARNING]
                        > Only call Hooks **at the top level**. Don’t call Hooks inside loops, conditions, or nested functions.
                        """, 
                        "https://www.youtube.com/embed/bMknfKXIFA8", 2L),
                createLesson(reactCourse, "Component Lifecycle", 
                        """
                        # 🔄 Component Lifecycle & `useEffect`
                        
                        The `useEffect` Hook lets you perform side effects in function components (e.g., data fetching, subscriptions, manually changing the DOM).
                        
                        ```javascript
                        useEffect(() => {
                          // 1. Setup / Effect logic here
                          const subscription = props.source.subscribe();
                        
                          // 2. Cleanup function (optional)
                          return () => {
                            subscription.unsubscribe();
                          };
                        }, [props.source]); // 3. Dependency array
                        ```
                        
                        > [!IMPORTANT]
                        > If you pass an empty array `[]` as the dependency array, the effect will only run once after the initial render (similar to `componentDidMount`).
                        """, 
                        "https://www.youtube.com/embed/bMknfKXIFA8", 3L)
        ));

        // Seed Lessons for Python
        lessonRepository.saveAll(List.of(
                createLesson(pythonCourse, "Python Basics", 
                        """
                        # 🐍 Python 101
                        
                        Welcome to Python! Python is an interpreted, high-level, general-purpose programming language. Its design philosophy emphasizes code readability.
                        
                        ## Hello World
                        ```python
                        def hello_world():
                            print("Hello, World!")
                        
                        if __name__ == "__main__":
                            hello_world()
                        ```
                        
                        > [!NOTE]
                        > Python uses whitespace indentation, rather than curly brackets or keywords, to delimit blocks.
                        """, 
                        "https://www.youtube.com/embed/_uQrJ0TkZlc", 1L),
                createLesson(pythonCourse, "Data Wrangling with Pandas", 
                        """
                        # 🐼 Pandas for Data Science
                        
                        Pandas is a fast, powerful, flexible and easy to use open source data analysis and manipulation tool.
                        
                        ## 📊 DataFrames
                        Think of a DataFrame as an Excel spreadsheet in code.
                        
                        ```python
                        import pandas as pd
                        
                        # Create a simple DataFrame
                        data = {'Name': ['Alice', 'Bob', 'Charlie'],
                                'Age': [25, 30, 35]}
                        
                        df = pd.DataFrame(data)
                        print(df.head())
                        ```
                        
                        | Name | Age |
                        |---|---|
                        | Alice | 25 |
                        | Bob | 30 |
                        | Charlie | 35 |
                        """, 
                        "https://www.youtube.com/embed/_uQrJ0TkZlc", 2L),
                createLesson(pythonCourse, "Intro to Scikit-Learn", 
                        """
                        # 🧠 Machine Learning Basics
                        
                        Let's train our first model using `scikit-learn`.
                        
                        ## Training a Linear Model
                        ```python
                        from sklearn.linear_model import LinearRegression
                        from sklearn.model_selection import train_test_split
                        
                        # Split data
                        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
                        
                        # Initialize and train
                        model = LinearRegression()
                        model.fit(X_train, y_train)
                        
                        # Predict
                        predictions = model.predict(X_test)
                        ```
                        """, 
                        "https://www.youtube.com/embed/_uQrJ0TkZlc", 3L),
                createLesson(pythonCourse, "Model Evaluation", 
                        """
                        # 📏 Evaluating Your Model
                        
                        How do you know if your model is actually good? You must evaluate it using rigorous metrics.
                        
                        ## Classification Metrics
                        
                        | Metric | Description | Formula |
                        |---|---|---|
                        | **Accuracy** | Overall correctness | `(TP + TN) / Total` |
                        | **Precision** | Exactness (minimize false positives) | `TP / (TP + FP)` |
                        | **Recall** | Completeness (minimize false negatives) | `TP / (TP + FN)` |
                        
                        > [!CAUTION]
                        > Beware of accuracy on imbalanced datasets! If 99% of your data belongs to class A, a model that simply always predicts A will have 99% accuracy but 0 predictive power.
                        """, 
                        "https://www.youtube.com/embed/_uQrJ0TkZlc", 4L)
        ));

        log.info("Database seed process completed successfully.");
    }

    private Course createCourse(String title, String description, String category, DifficultyLevel level, String thumbnailUrl, User instructor) {
        return Course.builder()
                .title(title)
                .description(description)
                .category(category)
                .difficultyLevel(level)
                .thumbnailUrl(thumbnailUrl)
                .status(CourseStatus.PUBLISHED)
                .instructor(instructor)
                .build();
    }

    private Lesson createLesson(Course course, String title, String content, String videoUrl, Long positionRank) {
        return Lesson.builder()
                .course(course)
                .title(title)
                .content(content)
                .videoUrl(videoUrl)
                .positionRank(positionRank)
                .build();
    }
}
