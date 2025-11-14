import { useState } from "react";
import { Calendar, Plus, Users, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Activities() {
  const [filter, setFilter] = useState<"upcoming" | "past">("upcoming");

  const { data: activities, isLoading } = useQuery({
    queryKey: ["/api/activities"],
  });

  const filteredActivities = activities?.filter((activity: any) => {
    const activityDate = new Date(activity.date);
    const now = new Date();
    if (filter === "upcoming") {
      return activityDate >= now;
    } else {
      return activityDate < now;
    }
  });

  return (
    <div className="min-h-screen pb-20 bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-card-border px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold font-poppins">Activités</h1>
            <Button size="icon" variant="default" data-testid="button-add-activity">
              <Plus className="h-5 w-5" />
            </Button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            <Button
              variant={filter === "upcoming" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("upcoming")}
              data-testid="filter-upcoming"
            >
              À venir
            </Button>
            <Button
              variant={filter === "past" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("past")}
              data-testid="filter-past"
            >
              Passées
            </Button>
          </div>
        </div>
      </div>

      {/* Activities List */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-32 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredActivities && filteredActivities.length > 0 ? (
          <div className="space-y-4">
            {filteredActivities.map((activity: any) => (
              <Card key={activity.id} className="hover-elevate" data-testid={`activity-card-${activity.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl font-bold font-poppins mb-2">
                        {activity.title}
                      </CardTitle>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(activity.date).toLocaleDateString('fr-FR', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>
                            {new Date(activity.date).toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge variant={filter === "upcoming" ? "default" : "secondary"}>
                      {filter === "upcoming" ? "À venir" : "Passée"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {activity.description && (
                    <p className="text-muted-foreground mb-4">{activity.description}</p>
                  )}
                  
                  {activity.responsibleName && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-muted-foreground mb-2">Responsable</p>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-semibold">
                          {activity.responsibleName.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <span className="text-sm font-medium">{activity.responsibleName}</span>
                      </div>
                    </div>
                  )}

                  {activity.participants && activity.participants.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">
                        Participants ({activity.participants.length})
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {activity.participants.slice(0, 5).map((participant: any, index: number) => (
                            <Avatar key={index} className="h-8 w-8 border-2 border-card">
                              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                {participant.name.split(' ').map((n: string) => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        {activity.participants.length > 5 && (
                          <span className="text-sm text-muted-foreground">
                            +{activity.participants.length - 5}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" data-testid={`button-view-activity-${activity.id}`}>
                      Voir détails
                    </Button>
                    {filter === "upcoming" && (
                      <Button variant="outline" size="sm" data-testid={`button-add-participants-${activity.id}`}>
                        <Users className="h-4 w-4 mr-2" />
                        Gérer participants
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-muted/30 rounded-full h-20 w-20 mx-auto mb-4 flex items-center justify-center">
              <Calendar className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Aucune activité {filter === "upcoming" ? "à venir" : "passée"}</h3>
            <p className="text-muted-foreground mb-4">
              {filter === "upcoming" 
                ? "Créez une nouvelle activité pour commencer" 
                : "Aucune activité enregistrée pour le moment"}
            </p>
            {filter === "upcoming" && (
              <Button variant="default" data-testid="button-create-first-activity">
                <Plus className="h-4 w-4 mr-2" />
                Créer une activité
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
