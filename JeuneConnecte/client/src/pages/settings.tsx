import { Cloud, Phone, Mail, MapPin, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import logoImage from "@assets/generated_images/Church_youth_group_logo_5bbf3ed6.png";

export default function Settings() {
  const handleSync = () => {
    // Will be implemented in integration phase
    console.log("Synchronisation...");
  };

  return (
    <div className="min-h-screen pb-20 bg-background">
      {/* Header */}
      <div className="bg-card border-b border-card-border px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold font-poppins">Paramètres</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Church Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold font-poppins">Informations de l'église</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <img src={logoImage} alt="Logo" className="h-20 w-20 rounded-lg bg-primary/10 p-2" />
              <div>
                <h2 className="text-xl font-bold font-poppins mb-1">Jeunesse Connectée</h2>
                <p className="text-sm text-muted-foreground">
                  Jeune pour Christ ACPE PHILADELPHIE
                </p>
              </div>
            </div>
            <Button variant="outline" data-testid="button-change-logo">
              Changer le logo
            </Button>
          </CardContent>
        </Card>

        {/* Sync Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold font-poppins">Synchronisation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Cloud className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">État de la synchronisation</p>
                  <p className="text-sm text-muted-foreground">
                    Dernière sync: Aujourd'hui à 14:30
                  </p>
                </div>
              </div>
              <Badge variant="default" className="bg-green-600">
                Synchronisé
              </Badge>
            </div>
            <Separator />
            <Button
              variant="outline"
              className="w-full"
              onClick={handleSync}
              data-testid="button-sync-data"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Synchroniser maintenant
            </Button>
            <p className="text-xs text-muted-foreground">
              Les données sont automatiquement synchronisées lorsque vous êtes connecté à Internet.
              En mode hors ligne, vos modifications seront enregistrées localement et synchronisées
              dès que la connexion sera rétablie.
            </p>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold font-poppins">Coordonnées du bureau jeunesse</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Téléphone</p>
                <p className="text-sm text-muted-foreground">+237 6XX XXX XXX</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-muted-foreground">jeunesse@acpe-philadelphie.org</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Adresse</p>
                <p className="text-sm text-muted-foreground">
                  ACPE PHILADELPHIE, Yaoundé, Cameroun
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold font-poppins">À propos de l'application</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Version</p>
              <p className="text-sm font-medium">1.0.0</p>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Type</p>
              <Badge variant="outline">Progressive Web App</Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Mode hors ligne</p>
              <Badge variant="default" className="bg-green-600">Activé</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
