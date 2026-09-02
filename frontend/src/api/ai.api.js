import axiosInstance from './axios';

/**
 * Send a question to the AI Tutor backend.
 * @param {string} question The user's question
 * @param {number|null} courseId Optional courseId for RAG context
 * @returns {Promise<{answer: string, modelUsed: string}>}
 */
export const askAiTutor = async (question, courseId, lessonTitle, history = []) => {
  const response = await axiosInstance.post('/api/v1/ai/ask', { question, courseId, lessonTitle, history });
  return response.data;
};
