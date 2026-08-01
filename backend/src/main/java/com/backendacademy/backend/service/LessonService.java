package com.backendacademy.backend.service;

import com.backendacademy.backend.model.User;
import com.backendacademy.backend.model.dto.CreateLessonRequest;
import com.backendacademy.backend.model.dto.LessonResponse;
import com.backendacademy.backend.model.dto.UpdateLessonRequest;

import java.util.List;

public interface LessonService {

    LessonResponse createLesson(Long courseId, CreateLessonRequest request, User currentUser);

    List<LessonResponse> getLessonsByCourseId(Long courseId, User currentUser);

    LessonResponse getLessonById(Long id, User currentUser);

    LessonResponse updateLesson(Long id, UpdateLessonRequest request, User currentUser);

    void deleteLesson(Long id, User currentUser);
}
