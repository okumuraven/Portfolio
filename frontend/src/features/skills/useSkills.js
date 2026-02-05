import { useQuery } from '@tanstack/react-query';
import { getSkills, getSkillById } from '../../api/skills.api';

/**
 * Fetch all skills (optionally with query/filter params)
 * @param {object} options – react-query options (enabled, staleTime, etc)
 * @returns {object} – { data, isLoading, isError, ... }
 */
export function useSkills(options = {}) {
  return useQuery({
    queryKey: ['skills'],
    queryFn: getSkills,
    staleTime: 10 * 60 * 1000, // 10 minutes, for performance
    select: res => res.data,
    ...options
  });
}

/**
 * Fetch a single skill by id
 * @param {string|number} id – the skill's id
 * @param {object} options – react-query options
 * @returns {object}
 */
export function useSkill(id, options = {}) {
  return useQuery({
    queryKey: ['skills', id],
    queryFn: () => getSkillById(id),
    enabled: Boolean(id),
    select: res => res.data,
    ...options
  });
}