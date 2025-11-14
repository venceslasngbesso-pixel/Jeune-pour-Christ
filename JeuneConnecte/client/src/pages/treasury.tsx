import { useState } from "react";
import { DollarSign, TrendingUp, Users, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/stat-card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Treasury() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString());

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/contributions/stats"],
  });

  const { data: contributions, isLoading: contributionsLoading } = useQuery({
    queryKey: ["/api/contributions"],
  });

  const { data: monthlyChart, isLoading: chartLoading } = useQuery({
    queryKey: ["/api/contributions/monthly-chart", selectedYear],
  });

  const months = [
    { value: "1", label: "Janvier" },
    { value: "2", label: "Février" },
    { value: "3", label: "Mars" },
    { value: "4", label: "Avril" },
    { value: "5", label: "Mai" },
    { value: "6", label: "Juin" },
    { value: "7", label: "Juillet" },
    { value: "8", label: "Août" },
    { value: "9", label: "Septembre" },
    { value: "10", label: "Octobre" },
    { value: "11", label: "Novembre" },
    { value: "12", label: "Décembre" },
  ];

  const years = [currentYear - 1, currentYear, currentYear + 1];

  return (
    <div className="min-h-screen pb-20 bg-background">
      {/* Header */}
      <div className="bg-card border-b border-card-border px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold font-poppins mb-4">Trésorerie</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {statsLoading ? (
            <>
              {[1, 2, 3].map((i) => (
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
                title="Total général"
                value={`${stats?.total || 0} FCFA`}
                icon={DollarSign}
                iconColor="text-primary"
              />
              <StatCard
                title="Ce mois"
                value={`${stats?.thisMonth || 0} FCFA`}
                icon={TrendingUp}
                iconColor="text-secondary"
              />
              <StatCard
                title="Membres à jour"
                value={`${stats?.upToDate || 0}/${stats?.totalMembers || 0}`}
                icon={Users}
                iconColor="text-green-600"
              />
            </>
          )}
        </div>

        {/* Monthly Chart */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold font-poppins">
              Évolution mensuelle - {selectedYear}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chartLoading ? (
              <Skeleton className="h-80 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={monthlyChart}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis 
                    dataKey="month" 
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                  />
                  <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Contributions List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
            <CardTitle className="text-lg font-semibold font-poppins">Historique des cotisations</CardTitle>
            <div className="flex gap-2">
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-[140px]" data-testid="select-month">
                  <SelectValue placeholder="Mois" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[120px]" data-testid="select-year">
                  <SelectValue placeholder="Année" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {contributionsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : contributions && contributions.length > 0 ? (
              <div className="space-y-3">
                {contributions
                  .filter((c: any) => 
                    c.month === parseInt(selectedMonth) && 
                    c.year === parseInt(selectedYear)
                  )
                  .map((contribution: any) => (
                    <div
                      key={contribution.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover-elevate"
                      data-testid={`contribution-item-${contribution.id}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{contribution.memberName}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(contribution.paidDate).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{contribution.amount} FCFA</p>
                        <Badge variant={contribution.status === "paid" ? "default" : "destructive"} className="text-xs">
                          {contribution.status === "paid" ? "Payé" : "Non payé"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                {contributions.filter((c: any) => 
                  c.month === parseInt(selectedMonth) && 
                  c.year === parseInt(selectedYear)
                ).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucune cotisation pour cette période
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Aucune cotisation enregistrée
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
