import http from './http';

// Get all skills (Public)
export const getSkills = () => http.get('/skills');

// Get skill by id (Public)
export const getSkillById = (id) => http.get(`/skills/${id}`);

// Create new skill (Admin)
export const createSkill = (data) => http.post('/skills', data);

// Update skill (Admin)
export const updateSkill = (id, data) => http.patch(`/skills/${id}`, data);

// Delete skill (Admin)
export const deleteSkill = (id) => http.delete(`/skills/${id}`);