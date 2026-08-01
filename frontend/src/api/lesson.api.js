import api from './axios';

/**
 * Adapter to map backend LessonResponse DTO to the frontend UI format.
 */
const adaptLesson = (lesson) => {
  return {
    id: lesson.id,
    courseId: lesson.courseId,
    title: lesson.title,
    content: lesson.content,
    videoUrl: lesson.videoUrl,
    positionRank: lesson.positionRank,
    // Add UI placeholders for missing data if needed
    duration: '15 min', 
    type: lesson.videoUrl ? 'video' : 'reading'
  };
};

export const getCourseLessons = async (courseId) => {
  const response = await api.get(`/api/v1/courses/${courseId}/lessons`);
  // Map and sort by positionRank to ensure correct ordering
  return response.data
    .map(adaptLesson)
    .sort((a, b) => a.positionRank - b.positionRank);
};

export const createLesson = async (courseId, lessonData) => {
  const response = await api.post(`/api/v1/courses/${courseId}/lessons`, lessonData);
  return adaptLesson(response.data);
};
