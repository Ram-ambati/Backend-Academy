import api from './axios';

/**
 * Adapter to map backend EnrollmentResponse DTO to the frontend UI format.
 */
const adaptEnrollment = (enrollment) => {
  return {
    id: enrollment.id,
    studentId: enrollment.studentId,
    courseId: enrollment.courseId,
    courseTitle: enrollment.courseTitle,
    courseThumbnailUrl: enrollment.courseThumbnailUrl,
    progressPercentage: enrollment.progressPercentage || 0,
    enrolledAt: enrollment.enrolledAt,
    completedAt: enrollment.completedAt
  };
};

export const enrollStudent = async (courseId) => {
  const response = await api.post(`/api/v1/courses/${courseId}/enroll`);
  return adaptEnrollment(response.data);
};

export const completeLesson = async (lessonId) => {
  const response = await api.post(`/api/v1/lessons/${lessonId}/complete`);
  return response.data;
};

export const getMyEnrollments = async () => {
  const response = await api.get('/api/v1/users/me/enrollments');
  return response.data.map(adaptEnrollment);
};
