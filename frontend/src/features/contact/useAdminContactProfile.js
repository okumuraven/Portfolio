import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllContactFieldsAdmin,
  createContactField,
  updateContactField,
  deleteContactField,
} from "../../api/contact.api";

/**
 * Admin: Handle all CRUD for profile/contact fields.
 * Returns: query result + mutation functions + loading/error states.
 */
export function useAdminContactProfile() {
  const queryClient = useQueryClient();

  // Get all fields (incl. hidden) for admin table
  const fieldsQuery = useQuery({
    queryKey: ["admin-contact-fields"],
    queryFn: getAllContactFieldsAdmin,
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });

  // Add field
  const addField = useMutation({
    mutationFn: createContactField,
    onSuccess: () => queryClient.invalidateQueries(["admin-contact-fields"]),
  });

  // Update field
  const updateField = useMutation({
    mutationFn: ({ id, updates }) => updateContactField(id, updates),
    onSuccess: () => queryClient.invalidateQueries(["admin-contact-fields"]),
  });

  // Delete field
  const deleteField = useMutation({
    mutationFn: deleteContactField,
    onSuccess: () => queryClient.invalidateQueries(["admin-contact-fields"]),
  });

  return {
    fields: fieldsQuery.data,
    isLoading: fieldsQuery.isLoading,
    error: fieldsQuery.error,
    refetch: fieldsQuery.refetch,
    addField,
    updateField,
    deleteField,
  };
}