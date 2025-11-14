import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BottomNav } from "@/components/bottom-nav";
import Dashboard from "@/pages/dashboard";
import Members from "@/pages/members";
import MemberDetail from "@/pages/member-detail";
import Treasury from "@/pages/treasury";
import Attendance from "@/pages/attendance";
import Activities from "@/pages/activities";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/membres" component={Members} />
      <Route path="/membres/:id" component={MemberDetail} />
      <Route path="/tresorerie" component={Treasury} />
      <Route path="/presences" component={Attendance} />
      <Route path="/activites" component={Activities} />
      <Route path="/parametres" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="relative min-h-screen">
          <Router />
          <BottomNav />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
