import { Users, DollarSign, TrendingUp, Calendar, UserPlus, Wallet, ClipboardCheck } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import logoImage from "@assets/generated_images/Church_youth_group_logo_5bbf3ed6.png";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/stats"],
  });

  const { data: upcomingActivities, isLoading: activitiesLoading } = useQuery({
    queryKey: ["/api/activities/upcoming"],
  });

  return (
    <div className="min-h-screen pb-20 bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground px-4 pt-6 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <img src={logoImage} alt="Logo" className="h-12 w-12 rounded-lg bg-white/90 p-1" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold font-poppins">Jeunesse Connectée</h1>
              <p className="text-xs md:text-sm opacity-90">Jeune pour Christ ACPE PHILADELPHIE</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {statsLoading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-24 w-full" />
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            <>
              <StatCard
                title="Total Membres"
                value={stats?.totalMembers || 0}
                icon={Users}
                iconColor="text-primary"
              />
              <StatCard
                title="Cotisations ce mois"
                value={`${stats?.monthlyContributions || 0} FCFA`}
                icon={DollarSign}
                iconColor="text-secondary"
              />
              <StatCard
                title="Taux de présence"
                value={`${stats?.attendanceRate || 0}%`}
                icon={TrendingUp}
                iconColor="text-green-600"
              />
              <StatCard
                title="Activités à venir"
                value={stats?.upcomingActivities || 0}
                icon={Calendar}
                iconColor="text-blue-600"
              />
            </>
          )}
        </div>

        {/* Quick Actions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold font-poppins">Actions rapides</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-14 justify-start gap-3"
              data-testid="button-add-member"
            >
              <UserPlus className="h-5 w-5 text-primary" />
              <span>Ajouter un membre</span>
            </Button>
            <Button
              variant="outline"
              className="h-14 justify-start gap-3"
              data-testid="button-record-contribution"
            >
              <Wallet className="h-5 w-5 text-secondary" />
              <span>Enregistrer une cotisation</span>
            </Button>
            <Button
              variant="outline"
              className="h-14 justify-start gap-3"
              data-testid="button-record-attendance"
            >
              <ClipboardCheck className="h-5 w-5 text-green-600" />
              <span>Enregistrer une présence</span>
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Activities */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold font-poppins">Activités à venir</CardTitle>
            <Button variant="ghost" size="sm" data-testid="button-view-all-activities">
              Voir tout
            </Button>
          </CardHeader>
          <CardContent>
            {activitiesLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : upcomingActivities && upcomingActivities.length > 0 ? (
              <div className="space-y-4">
                {upcomingActivities.slice(0, 3).map((activity: any) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-4 rounded-lg border border-border hover-elevate"
                    data-testid={`activity-card-${activity.id}`}
                  >
                    <div className="flex-shrink-0 bg-primary/10 p-3 rounded-lg">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base mb-1">{activity.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {activity.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {new Date(activity.date).toLocaleDateString('fr-FR')}
                        </Badge>
                        {activity.participantCount && (
                          <span className="text-xs text-muted-foreground">
                            {activity.participantCount} participants
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Aucune activité prévue pour le moment</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
