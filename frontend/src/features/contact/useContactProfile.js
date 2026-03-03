import { useQuery } from "@tanstack/react-query";
import { getContactProfile } from "../../api/contact.api";

/**
 * Public: Returns all visible profile/contact fields (for site display).
 * Caches and handles loading/error states.
 */
export function useContactProfile(options = {}) {
  return useQuery({
    queryKey: ["contact-profile"],
    queryFn: getContactProfile,
    staleTime: 1000 * 60 * 10, // 10 min, can be adjusted
    refetchOnWindowFocus: false,
    ...options,
  });
}