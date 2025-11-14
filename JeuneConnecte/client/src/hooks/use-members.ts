import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { type InsertMember } from "@shared/schema";
import { useToast } from "./use-toast";

export function useMembers() {
  const { toast } = useToast();

  const createMember = useMutation({
    mutationFn: async (data: InsertMember) => {
      return await apiRequest("POST", "/api/members", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/members"] });
      toast({
        title: "Membre ajouté",
        description: "Le membre a été ajouté avec succès.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le membre.",
        variant: "destructive",
      });
    },
  });

  const updateMember = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertMember> }) => {
      return await apiRequest("PUT", `/api/members/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/members"] });
      toast({
        title: "Membre mis à jour",
        description: "Les informations ont été mises à jour avec succès.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le membre.",
        variant: "destructive",
      });
    },
  });

  const deleteMember = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/members/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/members"] });
      toast({
        title: "Membre supprimé",
        description: "Le membre a été supprimé avec succès.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le membre.",
        variant: "destructive",
      });
    },
  });

  return {
    createMember,
    updateMember,
    deleteMember,
  };
}
