import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { type InsertAttendance } from "@shared/schema";
import { useToast } from "./use-toast";

export function useAttendances() {
  const { toast } = useToast();

  const createAttendance = useMutation({
    mutationFn: async (data: InsertAttendance) => {
      return await apiRequest("POST", "/api/attendances", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/attendances"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Présence enregistrée",
        description: "La présence a été enregistrée avec succès.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la présence.",
        variant: "destructive",
      });
    },
  });

  const bulkCreateAttendances = useMutation({
    mutationFn: async (data: InsertAttendance[]) => {
      if (data.length === 0) {
        throw new Error("Aucune présence à enregistrer");
      }
      return await apiRequest("POST", "/api/attendances/bulk", data);
    },
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["/api/attendances"] });
      await queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      
      const uniqueMemberIds = [...new Set(variables.map(a => a.memberId))];
      for (const memberId of uniqueMemberIds) {
        await queryClient.invalidateQueries({ queryKey: ["/api/attendances/member", memberId] });
      }
      
      toast({
        title: "Présences enregistrées",
        description: `${variables.length} présences ont été enregistrées avec succès.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'enregistrer les présences.",
        variant: "destructive",
      });
    },
  });

  return {
    createAttendance,
    bulkCreateAttendances,
  };
}
