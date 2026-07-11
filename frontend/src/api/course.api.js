/**
 * Mock Course API
 */

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const MOCK_COURSES = [
  { id: 1, title: 'Spring Boot Masterclass', category: 'Backend', level: 'Intermediate', emoji: '⚙️', lessons: 24, duration: '8h 30m', rating: 4.9, progress: 65, description: 'Master Spring Boot from scratch with REST APIs, JPA, and Security.', instructor: { name: 'Dr. Ram A', initials: 'RA' } },
  { id: 2, title: 'Database Design & SQL', category: 'Database', level: 'Beginner', emoji: '🗄️', lessons: 18, duration: '5h 45m', rating: 4.7, progress: 30, description: 'Design relational databases and write powerful SQL queries.', instructor: { name: 'Prof. Anita', initials: 'AS' } },
  { id: 3, title: 'Microservices with Docker', category: 'DevOps', level: 'Advanced', emoji: '🐳', lessons: 32, duration: '12h', rating: 4.8, progress: 0, description: 'Build and deploy microservices using Docker and Kubernetes.', instructor: { name: 'Mr. Kiran', initials: 'KP' } },
];

export const getCourses = async () => {
  await delay(600);
  return MOCK_COURSES;
};

export const getCourseById = async (id) => {
  await delay(400);
  const course = MOCK_COURSES.find(c => c.id === parseInt(id));
  if (!course) throw new Error("Course not found");
  return course;
};
