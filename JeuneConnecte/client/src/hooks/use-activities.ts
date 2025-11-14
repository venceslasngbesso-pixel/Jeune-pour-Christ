import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { type InsertActivity } from "@shared/schema";
import { useToast } from "./use-toast";

export function useActivities() {
  const { toast } = useToast();

  const createActivity = useMutation({
    mutationFn: async (data: InsertActivity) => {
      return await apiRequest("POST", "/api/activities", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Activité créée",
        description: "L'activité a été créée avec succès.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de créer l'activité.",
        variant: "destructive",
      });
    },
  });

  const updateActivity = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertActivity> }) => {
      return await apiRequest("PUT", `/api/activities/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      toast({
        title: "Activité mise à jour",
        description: "L'activité a été mise à jour avec succès.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'activité.",
        variant: "destructive",
      });
    },
  });

  const deleteActivity = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/activities/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Activité supprimée",
        description: "L'activité a été supprimée avec succès.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'activité.",
        variant: "destructive",
      });
    },
  });

  return {
    createActivity,
    updateActivity,
    deleteActivity,
  };
}
