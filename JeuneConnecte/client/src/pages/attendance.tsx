import { useState } from "react";
import { CheckSquare, Calendar, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SERVICE_TYPES } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { useAttendances } from "@/hooks/use-attendances";

export default function Attendance() {
  const [selectedService, setSelectedService] = useState(SERVICE_TYPES.SUNDAY_WORSHIP);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());

  const { data: members, isLoading: membersLoading } = useQuery({
    queryKey: ["/api/members"],
  });

  const { data: attendances, isLoading: attendancesLoading } = useQuery({
    queryKey: ["/api/attendances"],
  });

  const { bulkCreateAttendances } = useAttendances();

  const toggleMember = (memberId: string) => {
    const newSelected = new Set(selectedMembers);
    if (newSelected.has(memberId)) {
      newSelected.delete(memberId);
    } else {
      newSelected.add(memberId);
    }
    setSelectedMembers(newSelected);
  };

  const selectAll = () => {
    if (members) {
      setSelectedMembers(new Set(members.map((m: any) => m.id)));
    }
  };

  const deselectAll = () => {
    setSelectedMembers(new Set());
  };

  const handleSubmit = () => {
    const attendanceData = Array.from(selectedMembers).map((memberId) => ({
      memberId,
      serviceType: selectedService,
      date: selectedDate,
      present: true,
    }));

    bulkCreateAttendances.mutate(attendanceData, {
      onSuccess: () => {
        setSelectedMembers(new Set());
      },
    });
  };

  return (
    <div className="min-h-screen pb-20 bg-background">
      {/* Header */}
      <div className="bg-card border-b border-card-border px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold font-poppins mb-4">Présences</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Quick Check-in */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold font-poppins">Enregistrer les présences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Service Type & Date Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Type de culte</label>
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger data-testid="select-service-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(SERVICE_TYPES).map((service) => (
                      <SelectItem key={service} value={service}>
                        {service}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Date</label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  data-testid="input-attendance-date"
                />
              </div>
            </div>

            {/* Batch Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={selectAll}
                data-testid="button-select-all"
              >
                Tout sélectionner
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={deselectAll}
                data-testid="button-deselect-all"
              >
                Tout désélectionner
              </Button>
            </div>

            {/* Members List with Checkboxes */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {membersLoading ? (
                <>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-14 w-full" />
                  ))}
                </>
              ) : members && members.length > 0 ? (
                members.map((member: any) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-4 p-3 rounded-lg border border-border hover-elevate"
                    data-testid={`member-checkbox-${member.id}`}
                  >
                    <Checkbox
                      checked={selectedMembers.has(member.id)}
                      onCheckedChange={() => toggleMember(member.id)}
                      id={`member-${member.id}`}
                    />
                    <label
                      htmlFor={`member-${member.id}`}
                      className="flex-1 flex items-center gap-3 cursor-pointer"
                    >
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                        {member.firstName[0]}{member.lastName[0]}
                      </div>
                      <div>
                        <p className="font-medium">{member.firstName} {member.lastName}</p>
                        <p className="text-xs text-muted-foreground">{member.churchRole || "Membre"}</p>
                      </div>
                    </label>
                    <Badge variant={member.isLeader ? "default" : "secondary"} className="text-xs">
                      {member.isLeader ? "Resp." : "Membre"}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun membre trouvé
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button
              className="w-full"
              size="lg"
              disabled={selectedMembers.size === 0 || bulkCreateAttendances.isPending}
              onClick={handleSubmit}
              data-testid="button-submit-attendance"
            >
              <CheckSquare className="h-5 w-5 mr-2" />
              {bulkCreateAttendances.isPending 
                ? "Enregistrement..." 
                : `Enregistrer (${selectedMembers.size} présent${selectedMembers.size > 1 ? 's' : ''})`
              }
            </Button>
          </CardContent>
        </Card>

        {/* Attendance History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold font-poppins">Historique des présences</CardTitle>
          </CardHeader>
          <CardContent>
            {attendancesLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : attendances && attendances.length > 0 ? (
              <div className="space-y-4">
                {/* Group by date */}
                {Object.entries(
                  attendances.reduce((groups: any, attendance: any) => {
                    const date = attendance.date;
                    if (!groups[date]) {
                      groups[date] = [];
                    }
                    groups[date].push(attendance);
                    return groups;
                  }, {})
                ).slice(0, 5).map(([date, dayAttendances]: [string, any]) => (
                  <div key={date} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-semibold">
                            {new Date(date).toLocaleDateString('fr-FR', { 
                              weekday: 'long', 
                              day: 'numeric', 
                              month: 'long', 
                              year: 'numeric' 
                            })}
                          </p>
                          <p className="text-sm text-muted-foreground">{dayAttendances[0].serviceType}</p>
                        </div>
                      </div>
                      <Badge variant="outline">
                        {dayAttendances.filter((a: any) => a.present).length}/{dayAttendances.length}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {dayAttendances.slice(0, 10).map((attendance: any) => (
                        <Badge
                          key={attendance.id}
                          variant={attendance.present ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {attendance.memberName}
                        </Badge>
                      ))}
                      {dayAttendances.length > 10 && (
                        <Badge variant="outline" className="text-xs">
                          +{dayAttendances.length - 10}
                        </Badge>
                      )}
                    </div>
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
      </div>
    </div>
  );
}
