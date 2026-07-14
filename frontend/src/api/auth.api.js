import api from './axios';

/**
 * Real Auth API calling Spring Boot backend
 */

export const login = async (email, password) => {
  try {
    const response = await api.post('/api/v1/auth/login', { email, password });
    // Map response structure to frontend's expected properties:
    // { token, user } where token is accessToken
    return {
      token: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      user: response.data.user
    };
  } catch (error) {
    const message = error.response?.data?.message || 'Invalid email or password';
    throw new Error(message);
  }
};

export const registerStudent = async (data) => {
  try {
    // Map frontend's experience select value to experienceLevel in the API contract
    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
      experienceLevel: data.experience,
      faculty: data.faculty
    };
    const response = await api.post('/api/v1/auth/register/student', payload);
    return {
      token: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      user: response.data.user
    };
  } catch (error) {
    const message = error.response?.data?.message || 'Registration failed';
    throw new Error(message);
  }
};

export const registerInstructor = async (data) => {
  try {
    const response = await api.post('/api/v1/auth/register/instructor', data);
    return {
      token: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      user: response.data.user
    };
  } catch (error) {
    const message = error.response?.data?.message || 'Registration failed';
    throw new Error(message);
  }
};

export const getMe = async () => {
  const response = await api.get('/api/v1/auth/me');
  return response.data;
};

export const refresh = async (refreshToken) => {
  const response = await api.post('/api/v1/auth/refresh', { refreshToken });
  return response.data;
};
