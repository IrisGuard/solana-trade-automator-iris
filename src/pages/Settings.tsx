
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth"; 
import { ErrorLogsViewer } from "@/components/settings/ErrorLogsViewer";
import { useLanguage } from "@/hooks/use-language";

export default function Settings() {
  const { user } = useAuth();
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t("general.settings")}</h2>
        <p className="text-muted-foreground">
          {t("settings.manageAccount")}
        </p>
      </div>
      
      <Tabs defaultValue="account" className="space-y-4">
        <TabsList>
          <TabsTrigger value="account">{t("settings.accountSettings")}</TabsTrigger>
          <TabsTrigger value="appearance">{t("settings.appearance")}</TabsTrigger>
          <TabsTrigger value="notifications">{t("settings.notifications")}</TabsTrigger>
          <TabsTrigger value="advanced">{t("settings.advanced")}</TabsTrigger>
          <TabsTrigger value="diagnostics">{t("settings.diagnostics")}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.accountSettings")}</CardTitle>
              <CardDescription>
                {t("settings.manageAccount")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <div className="text-sm font-medium">Email</div>
                <div className="rounded p-2 bg-muted">{user?.email || "Δεν έχει οριστεί email"}</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.appearance")}</CardTitle>
              <CardDescription>
                {t("settings.platformPreferences")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-muted-foreground">
                {t("settings.comingSoon")}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.notifications")}</CardTitle>
              <CardDescription>
                {t("settings.platformPreferences")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-muted-foreground">
                {t("settings.comingSoon")}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.advanced")}</CardTitle>
              <CardDescription>
                {t("settings.platformPreferences")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-muted-foreground">
                {t("settings.comingSoon")}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="diagnostics">
          <ErrorLogsViewer />
          
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.systemInfo")}</CardTitle>
              <CardDescription>
                {t("settings.platformPreferences")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-sm font-medium">{t("settings.browser")}</div>
                  <div className="text-sm text-muted-foreground">{navigator.userAgent}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">{t("settings.language")}</div>
                  <div className="text-sm text-muted-foreground">{navigator.language}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
