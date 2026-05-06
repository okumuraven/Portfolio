import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import recoveryApi from '../../api/recovery.api';

export function useRecovery() {
  const queryClient = useQueryClient();

  const { data: status, isLoading, isPlaceholderData, error } = useQuery({
    queryKey: ['recovery-status'],
    queryFn: async () => {
      const response = await recoveryApi.getStatus();
      return response.data;
    },
    refetchInterval: 300000, // Increase to 5 minutes to avoid frequent jarring reloads
    staleTime: 60000, // Consider data fresh for 1 minute
    placeholderData: (prev) => prev, // Keep previous data visible while fetching
  });

  const logUrgeMutation = useMutation({
    mutationFn: (data) => recoveryApi.logUrge(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recovery-status'] });
    },
  });

  const resetStreakMutation = useMutation({
    mutationFn: (data) => recoveryApi.resetStreak(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recovery-status'] });
    },
  });

  const panicMutation = useMutation({
    mutationFn: () => recoveryApi.panic(),
  });

  const addReasonMutation = useMutation({
    mutationFn: (data) => recoveryApi.addReason(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recovery-status'] });
    },
  });

  const removeReasonMutation = useMutation({
    mutationFn: (id) => recoveryApi.removeReason(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recovery-status'] });
    },
  });

  const chatMutation = useMutation({
    mutationFn: (data) => recoveryApi.chat(data),
  });

  const generateBriefingMutation = useMutation({
    mutationFn: () => recoveryApi.generateBriefing(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recovery-status'] });
    },
  });

  const surgicalResetMutation = useMutation({
    mutationFn: () => recoveryApi.surgicalReset(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recovery-status'] });
    },
  });

  return {
    status,
    isLoading,
    isPlaceholderData,
    error,
    logUrge: logUrgeMutation.mutateAsync,
    isLoggingUrge: logUrgeMutation.isPending,
    resetStreak: resetStreakMutation.mutateAsync,
    isResetting: resetStreakMutation.isPending,
    panic: panicMutation.mutateAsync,
    isPanicking: panicMutation.isPending,
    addReason: addReasonMutation.mutateAsync,
    removeReason: removeReasonMutation.mutateAsync,
    chat: chatMutation.mutateAsync,
    isChatting: chatMutation.isPending,
    generateBriefing: generateBriefingMutation.mutateAsync,
    isGeneratingBriefing: generateBriefingMutation.isPending,
    surgicalReset: surgicalResetMutation.mutateAsync,
    isSurgicallyResetting: surgicalResetMutation.isPending,
    testEmail: useMutation({
      mutationFn: () => recoveryApi.testEmail(),
    }).mutateAsync,
    isTestingEmail: useMutation({
      mutationFn: () => recoveryApi.testEmail(),
    }).isPending,
  };
}
