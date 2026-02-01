import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPersonas,
  getPublicPersonas,
  getPersona,
  createPersona,
  updatePersona,
  deletePersona,
} from "../../api/personas.api";

/**
 * Main Personas Hook
 * - If admin, set isAdmin true to use /api/personas (instead of /public)
 */
export function usePersonas({ isAdmin = false } = {}) {
  const queryClient = useQueryClient();

  // Fetch all personas (admin or public endpoint)
  const {
    data: personas = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [isAdmin ? "personas-admin" : "personas-public"],
    queryFn: isAdmin ? getPersonas : getPublicPersonas,
  });

  // Fetch one persona by ID (on demand)
  function usePersonaById(id) {
    return useQuery({
      queryKey: ["persona", id],
      queryFn: () => getPersona(id),
      enabled: !!id,
    });
  }

  // Local state for persona switching (Chameleon mode)
  const [activePersonaId, setActivePersonaId] = useState(() =>
    localStorage.getItem("activePersonaId") || ""
  );
  useEffect(() => {
    if (activePersonaId) localStorage.setItem("activePersonaId", activePersonaId);
  }, [activePersonaId]);

  // Get the active persona (default to first if ID invalid/empty)
  const activePersona = personas.find(
    (p) => String(p.id) === String(activePersonaId)
  ) || personas[0];

  // -------- Mutations (Admin only) --------
  const createMutation = useMutation({
    mutationFn: createPersona,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["personas-admin"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updatePersona(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["personas-admin"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deletePersona(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["personas-admin"] }),
  });

  // -------- Return API --------
  return {
    personas,
    isLoading,
    isError,
    error,
    refetch,
    // Chameleon
    activePersona,
    activePersonaId,
    setActivePersonaId,
    // Single fetch
    usePersonaById,
    // Mutations
    createPersona: createMutation.mutateAsync,
    updatePersona: updateMutation.mutateAsync,
    deletePersona: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}