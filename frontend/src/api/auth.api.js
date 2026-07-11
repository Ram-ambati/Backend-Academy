/**
 * Mock Auth API
 */

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const login = async (email, password) => {
  await delay(800);
  
  if (email === 'admin@test.com' && password === 'password') {
    return { token: 'mock-admin-token', user: { id: 1, name: 'Super Admin', email, role: 'ADMIN' } };
  }
  
  if (email === 'instructor@test.com' && password === 'password') {
    return { token: 'mock-instructor-token', user: { id: 2, name: 'Dr. John Doe', email, role: 'INSTRUCTOR', initials: 'JD' } };
  }
  
  if (email === 'student@test.com' && password === 'password') {
    return { token: 'mock-student-token', user: { id: 3, name: 'Ram Ambati', email, role: 'STUDENT', initials: 'RA' } };
  }
  
  throw new Error('Invalid email or password');
};

export const registerStudent = async (data) => {
  await delay(1000);
  return { token: 'mock-student-token', user: { id: 4, name: data.name, email: data.email, role: 'STUDENT', initials: data.name.substring(0, 2).toUpperCase() } };
};

export const registerInstructor = async (data) => {
  await delay(1000);
  return { token: 'mock-instructor-token', user: { id: 5, name: data.name, email: data.email, role: 'INSTRUCTOR', initials: data.name.substring(0, 2).toUpperCase() } };
};
