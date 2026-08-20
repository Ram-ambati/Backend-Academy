package com.backendacademy.backend.repository;

import com.backendacademy.backend.model.Course;
import com.backendacademy.backend.model.CourseStatus;
import com.backendacademy.backend.model.DifficultyLevel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    @EntityGraph(attributePaths = {"instructor"})
    Page<Course> findByInstructorId(Long instructorId, Pageable pageable);

    @EntityGraph(attributePaths = {"instructor"})
    Page<Course> findByStatus(CourseStatus status, Pageable pageable);

    @EntityGraph(attributePaths = {"instructor"})
    Page<Course> findByCategoryIgnoreCase(String category, Pageable pageable);

    @EntityGraph(attributePaths = {"instructor"})
    Page<Course> findByDifficultyLevel(DifficultyLevel level, Pageable pageable);

    /**
     * Native PostgreSQL Full-Text Search using the GIN index on search_vector.
     * MUST manually append `deleted_at IS NULL` because native queries ignore @SQLRestriction.
     */
    @Query(
        value = "SELECT * FROM courses c " +
                "WHERE c.status = :status AND c.deleted_at IS NULL " +
                "AND (:level IS NULL OR :level = 'ALL' OR c.difficulty_level = :level) " +
                "AND (:search IS NULL OR :search = '' OR c.search_vector @@ plainto_tsquery('english', :search))",
        countQuery = "SELECT count(*) FROM courses c " +
                     "WHERE c.status = :status AND c.deleted_at IS NULL " +
                     "AND (:level IS NULL OR :level = 'ALL' OR c.difficulty_level = :level) " +
                     "AND (:search IS NULL OR :search = '' OR c.search_vector @@ plainto_tsquery('english', :search))",
        nativeQuery = true
    )
    Page<Course> searchPublishedCourses(@Param("search") String search, @Param("level") String level, @Param("status") String status, Pageable pageable);
}

