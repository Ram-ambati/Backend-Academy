package com.backendacademy.backend.repository;

import com.backendacademy.backend.model.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {

    List<Lesson> findByCourseIdOrderByPositionRankAscUpdatedAtDesc(Long courseId);

    @Query("SELECT MAX(l.positionRank) FROM Lesson l WHERE l.course.id = :courseId")
    Optional<Long> findMaxPositionRankByCourseId(@Param("courseId") Long courseId);
}
