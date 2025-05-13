
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/hooks/use-language";

export function FaqSection() {
  const { t } = useLanguage();
  
  return (
    <section className="pt-8">
      <h2 className="text-2xl font-bold mb-6 text-center">{t("faq.title")}</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("faq.howItWorks.question")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              {t("faq.howItWorks.answer")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("faq.security.question")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              {t("faq.security.answer")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("faq.fees.question")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              {t("faq.fees.answer")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("faq.getStarted.question")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              {t("faq.getStarted.answer")}
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
