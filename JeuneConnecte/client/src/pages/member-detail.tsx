import { useState } from "react";
import { useRoute, Link } from "wouter";
import { ArrowLeft, Edit, Phone, MapPin, Briefcase, Church } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export default function MemberDetail() {
  const [, params] = useRoute("/membres/:id");
  const memberId = params?.id;

  const { data: member, isLoading: memberLoading } = useQuery({
    queryKey: ["/api/members", memberId],
  });

  const { data: contributions, isLoading: contributionsLoading } = useQuery({
    queryKey: ["/api/contributions/member", memberId],
  });

  const { data: attendances, isLoading: attendancesLoading } = useQuery({
    queryKey: ["/api/attendances/member", memberId],
  });

  if (memberLoading) {
    return (
      <div className="min-h-screen pb-20 bg-background">
        <div className="px-4 py-6">
          <Skeleton className="h-48 w-full mb-6" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen pb-20 bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Membre non trouvé</h2>
          <Link href="/membres">
            <Button variant="outline">Retour à la liste</Button>
          </Link>
        </div>
      </div>
    );
  }

  const totalContributions = contributions?.reduce((sum: number, c: any) => sum + c.amount, 0) || 0;
  const attendanceRate = attendances ? 
    Math.round((attendances.filter((a: any) => a.present).length / attendances.length) * 100) : 0;

  return (
    <div className="min-h-screen pb-20 bg-background">
      {/* Header with Back Button */}
      <div className="sticky top-0 z-10 bg-card border-b border-card-border px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/membres">
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <Button variant="outline" size="sm" data-testid="button-edit-member">
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Profile Hero */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={member.photoUrl} />
                <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
                  {member.firstName[0]}{member.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold font-poppins mb-2">
                  {member.firstName} {member.lastName}
                </h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                  <Badge variant={member.isLeader ? "default" : "secondary"}>
                    {member.isLeader ? "Responsable" : "Membre"}
                  </Badge>
                  <Badge variant="outline" className="border-green-500 text-green-700">
                    {member.status === "active" ? "Actif" : "Inactif"}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {member.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{member.phone}</span>
                    </div>
                  )}
                  {member.neighborhood && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{member.neighborhood}</span>
                    </div>
                  )}
                  {member.churchRole && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Church className="h-4 w-4" />
                      <span>{member.churchRole}</span>
                    </div>
                  )}
                  {member.externalRole && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Briefcase className="h-4 w-4" />
                      <span>{member.externalRole}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex md:flex-col gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold font-poppins text-primary">{totalContributions}</p>
                  <p className="text-xs text-muted-foreground">FCFA cotisés</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold font-poppins text-green-600">{attendanceRate}%</p>
                  <p className="text-xs text-muted-foreground">Présence</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="profile" data-testid="tab-profile">Profil</TabsTrigger>
            <TabsTrigger value="contributions" data-testid="tab-contributions">Cotisations</TabsTrigger>
            <TabsTrigger value="attendances" data-testid="tab-attendances">Présences</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Prénom</label>
                  <p className="text-base font-medium">{member.firstName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nom</label>
                  <p className="text-base font-medium">{member.lastName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date de naissance</label>
                  <p className="text-base font-medium">
                    {member.dateOfBirth ? new Date(member.dateOfBirth).toLocaleDateString('fr-FR') : 'Non renseigné'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Téléphone</label>
                  <p className="text-base font-medium">{member.phone || 'Non renseigné'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Quartier</label>
                  <p className="text-base font-medium">{member.neighborhood || 'Non renseigné'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Fonction église</label>
                  <p className="text-base font-medium">{member.churchRole || 'Non renseigné'}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">Fonction externe</label>
                  <p className="text-base font-medium">{member.externalRole || 'Non renseigné'}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contributions">
            <Card>
              <CardHeader>
                <CardTitle>Historique des cotisations</CardTitle>
              </CardHeader>
              <CardContent>
                {contributionsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : contributions && contributions.length > 0 ? (
                  <div className="space-y-3">
                    {contributions.map((contribution: any) => (
                      <div
                        key={contribution.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-border"
                        data-testid={`contribution-${contribution.id}`}
                      >
                        <div>
                          <p className="font-semibold">
                            {new Date(contribution.paidDate).toLocaleDateString('fr-FR', { 
                              month: 'long', 
                              year: 'numeric' 
                            })}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(contribution.paidDate).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-primary">{contribution.amount} FCFA</p>
                          <Badge variant={contribution.status === "paid" ? "default" : "destructive"} className="text-xs">
                            {contribution.status === "paid" ? "Payé" : "Non payé"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucune cotisation enregistrée
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendances">
            <Card>
              <CardHeader>
                <CardTitle>Historique des présences</CardTitle>
              </CardHeader>
              <CardContent>
                {attendancesLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : attendances && attendances.length > 0 ? (
                  <div className="space-y-3">
                    {attendances.map((attendance: any) => (
                      <div
                        key={attendance.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-border"
                        data-testid={`attendance-${attendance.id}`}
                      >
                        <div>
                          <p className="font-semibold">{attendance.serviceType}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(attendance.date).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <Badge variant={attendance.present ? "default" : "destructive"}>
                          {attendance.present ? "Présent" : "Absent"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucune présence enregistrée
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
