import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { type InsertContribution } from "@shared/schema";
import { useToast } from "./use-toast";

export function useContributions() {
  const { toast } = useToast();

  const createContribution = useMutation({
    mutationFn: async (data: InsertContribution) => {
      return await apiRequest("POST", "/api/contributions", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contributions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/contributions/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Cotisation enregistrée",
        description: "La cotisation a été enregistrée avec succès.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la cotisation.",
        variant: "destructive",
      });
    },
  });

  return {
    createContribution,
  };
}
