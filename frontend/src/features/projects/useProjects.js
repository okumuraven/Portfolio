import { useQuery, useMutation, useQueryClient } from "react-query";
import projectsAPI from "../../api/projects.api";

/**
 * useProjects — Manage projects collection (fetch, create, update, delete, filtering)
 * All project forms/tables/grids can use this hook for DRY and auto-refresh.
 *
 * Usage:
 *   const {
 *     projects, loading, error,
 *     refetch, createProject, updateProject, deleteProject
 *   } = useProjects();
 */

// KEYS for React Query cache (make this unique per dataset/query)
const PROJECTS_KEY = "projects";

export default function useProjects(filters = {}) {
  const queryClient = useQueryClient();

  // Fetch list of projects (with optional filter query)
  const {
    data: projects,
    error,
    isLoading: loading,
    refetch,
  } = useQuery([PROJECTS_KEY, filters], () => projectsAPI.getProjects(filters), {
    keepPreviousData: true,
    staleTime: 60000, // 1 min caching; tune as needed
  });

  // Mutations (Create, Update, Delete)
  const create = useMutation(projectsAPI.createProject, {
    onSuccess: () => queryClient.invalidateQueries(PROJECTS_KEY),
  });

  const update = useMutation(
    ({ id, formData }) => projectsAPI.updateProject(id, formData),
    { onSuccess: () => queryClient.invalidateQueries(PROJECTS_KEY) }
  );

  const del = useMutation(projectsAPI.deleteProject, {
    onSuccess: () => queryClient.invalidateQueries(PROJECTS_KEY),
  });

  // Individual project fetcher
  const getById = id => projectsAPI.getProjectById(id);

  return {
    projects: projects || [],
    loading,
    error,
    refetch,                                   // force reload
    createProject: create.mutateAsync,         // Pass FormData as parameter
    createLoading: create.isLoading,
    createError: create.error,
    updateProject: update.mutateAsync,         // Pass { id, formData }
    updateLoading: update.isLoading,
    updateError: update.error,
    deleteProject: del.mutateAsync,            // Pass projectId
    deleteLoading: del.isLoading,
    deleteError: del.error,
    getProjectById: getById,
  };
}