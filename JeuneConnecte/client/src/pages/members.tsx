import { useState } from "react";
import { Search, UserPlus, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";

export default function Members() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "members" | "leaders">("all");

  const { data: members, isLoading } = useQuery({
    queryKey: ["/api/members"],
  });

  const filteredMembers = members?.filter((member: any) => {
    const matchesSearch = 
      `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.phone?.includes(searchQuery);
    
    const matchesFilter = 
      filterStatus === "all" || 
      (filterStatus === "leaders" && member.isLeader) ||
      (filterStatus === "members" && !member.isLeader);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen pb-20 bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-card-border px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold font-poppins">Membres</h1>
            <Button size="icon" variant="default" data-testid="button-add-member">
              <UserPlus className="h-5 w-5" />
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un membre..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search-member"
            />
          </div>

          {/* Filter Chips */}
          <div className="flex gap-2">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("all")}
              data-testid="filter-all"
            >
              Tous
            </Button>
            <Button
              variant={filterStatus === "members" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("members")}
              data-testid="filter-members"
            >
              Membres
            </Button>
            <Button
              variant={filterStatus === "leaders" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("leaders")}
              data-testid="filter-leaders"
            >
              Responsables
            </Button>
          </div>
        </div>
      </div>

      {/* Members List */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredMembers && filteredMembers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMembers.map((member: any) => (
              <Link key={member.id} href={`/membres/${member.id}`}>
                <Card className="hover-elevate active-elevate-2 cursor-pointer" data-testid={`member-card-${member.id}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-14 w-14">
                        <AvatarImage src={member.photoUrl} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {member.firstName[0]}{member.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base mb-1 truncate">
                          {member.firstName} {member.lastName}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2 truncate">
                          {member.churchRole || "Membre"}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant={member.isLeader ? "default" : "secondary"} className="text-xs">
                            {member.isLeader ? "Responsable" : "Membre"}
                          </Badge>
                          {member.status === "active" && (
                            <Badge variant="outline" className="text-xs border-green-500 text-green-700">
                              Actif
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-muted/30 rounded-full h-20 w-20 mx-auto mb-4 flex items-center justify-center">
              <Filter className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Aucun membre trouvé</h3>
            <p className="text-muted-foreground">
              {searchQuery ? "Essayez une autre recherche" : "Commencez par ajouter un membre"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
