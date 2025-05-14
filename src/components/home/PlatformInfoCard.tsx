
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/use-language";

export function PlatformInfoCard() {
  const { t } = useLanguage();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("platform.title")}</CardTitle>
        <CardDescription>{t("platform.subtitle")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          {t("platform.description")}
        </p>
        <div className="bg-muted p-3 rounded-lg">
          <h4 className="font-medium mb-2">{t("platform.howItWorks")}</h4>
          <ul className="space-y-1 list-disc pl-5 text-sm">
            <li>{t("platform.feature1")}</li>
            <li>{t("platform.feature2")}</li>
            <li>{t("platform.feature3")}</li>
            <li>{t("platform.feature4")}</li>
            <li>{t("platform.feature5")}</li>
          </ul>
        </div>
        <Button variant="outline" className="w-full" asChild>
          <Link to="/bot-control">
            {t("platform.createBot")}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
