import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import projectsAPI from "../../api/projects.api";

/**
 * useProjects — Manage projects collection (fetch, create, update, delete, filtering)
 */

const PROJECTS_KEY = "projects";

export function useProjects(filters = {}) {
  const queryClient = useQueryClient();

  // Fetch list of projects (with optional filter query)
  const {
    data: projects,
    error,
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: [PROJECTS_KEY, filters],
    queryFn: () => projectsAPI.getProjects(filters),
    staleTime: 60000,
  });

  // Mutations (Create, Update, Delete)
  const create = useMutation({
    mutationFn: projectsAPI.createProject,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [PROJECTS_KEY] }),
  });

  const update = useMutation({
    mutationFn: ({ id, formData }) => projectsAPI.updateProject(id, formData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [PROJECTS_KEY] }),
  });

  const del = useMutation({
    mutationFn: projectsAPI.deleteProject,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [PROJECTS_KEY] }),
  });

  // Individual project fetcher
  const getById = id => projectsAPI.getProjectById(id);

  return {
    projects: projects || [],
    loading,
    error,
    refetch,
    createProject: create.mutateAsync,
    createLoading: create.isPending,
    createError: create.error,
    updateProject: update.mutateAsync,
    updateLoading: update.isPending,
    updateError: update.error,
    deleteProject: del.mutateAsync,
    deleteLoading: del.isPending,
    deleteError: del.error,
    getProjectById: getById,
  };
}

// Keep default export for compatibility if needed, but named is better
export default useProjects;