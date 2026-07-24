import api from './axios';

/**
 * Adapter to map backend CourseResponse DTO to the frontend UI format.
 * Injects safe UI defaults for fields that don't exist in the DB yet (lessons, rating, duration).
 */
const adaptCourse = (course) => {
  const getInitials = (name) => {
    if (!name) return 'IN';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return {
    id: course.id,
    title: course.title,
    description: course.description,
    category: course.category,
    // Map backend difficultyLevel (e.g. "BEGINNER") to UI level (e.g. "Beginner")
    level: course.difficultyLevel ? course.difficultyLevel.charAt(0) + course.difficultyLevel.slice(1).toLowerCase() : 'Beginner',
    status: course.status,
    thumbnail: course.thumbnailUrl,
    
    // UI-only mock fields (not in DB yet)
    lessons: 20,
    duration: '5h 30m',
    rating: 4.8,
    progress: 0,
    
    // Nest instructor data
    instructor: {
      id: course.instructorId,
      name: course.instructorName || 'Unknown Instructor',
      initials: getInitials(course.instructorName)
    },
    
    createdAt: course.createdAt,
    updatedAt: course.updatedAt
  };
};

/**
 * Paged Course Query API matching Spring Boot backend contract:
 * GET /api/v1/courses?page=0&size=6
 */
export const getCourses = async ({ page = 0, size = 6, search = '', category = '', level = '' } = {}) => {
  // Pass query params. Note: backend currently only supports page/size, 
  // but we pass search/category/level so it works immediately when backend is updated.
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });
  
  if (search) params.append('search', search);
  if (category && category !== 'ALL') params.append('category', category);
  if (level && level !== 'ALL') params.append('level', level);

  const response = await api.get(`/api/v1/courses?${params.toString()}`);
  const data = response.data; // PagedResponse
  
  return {
    content: (data.content || []).map(adaptCourse),
    page: data.page,
    size: data.size,
    totalElements: data.totalElements,
    totalPages: data.totalPages,
    last: data.last,
  };
};

export const getCourseById = async (id) => {
  const response = await api.get(`/api/v1/courses/${id}`);
  return adaptCourse(response.data);
};

/**
 * Public API — Featured courses for the landing page.
 * Uses the same endpoint but fetches a small page.
 */
export const getFeaturedCourses = async () => {
  const response = await api.get('/api/v1/courses?page=0&size=3');
  return (response.data.content || []).map(adaptCourse);
};

/**
 * Student Enrollments API
 * In production: GET /api/v1/students/me/enrollments
 * Currently mocked to return an empty array until enrollments API is built.
 */
export const getStudentEnrollments = async () => {
  // For now, return empty until the real enrollments backend endpoint exists
  return [];
};

/**
 * Instructor API — Get courses owned by the current instructor
 * GET /api/v1/courses/my
 */
export const getMyCourses = async ({ page = 0, size = 10 } = {}) => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });
  const response = await api.get(`/api/v1/courses/my?${params.toString()}`);
  const data = response.data;
  return {
    content: (data.content || []).map(adaptCourse),
    page: data.page,
    size: data.size,
    totalElements: data.totalElements,
    totalPages: data.totalPages,
    last: data.last,
  };
};

/**
 * Instructor API — Create a new course
 * POST /api/v1/courses
 */
export const createCourse = async (courseData) => {
  const response = await api.post('/api/v1/courses', courseData);
  return adaptCourse(response.data);
};

/**
 * Instructor API — Update an existing course
 * PUT /api/v1/courses/{id}
 */
export const updateCourse = async (id, courseData) => {
  const response = await api.put(`/api/v1/courses/${id}`, courseData);
  return adaptCourse(response.data);
};
