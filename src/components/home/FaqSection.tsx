
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/hooks/use-language";

export function FaqSection() {
  const { t } = useLanguage();
  
  return (
    <section className="pt-8 pb-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">{t("faq.title")}</h2>
        <div className="grid md:grid-cols-2 gap-6">
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
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("faq.trading.question")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                {t("faq.trading.answer")}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("faq.tokens.question")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                {t("faq.tokens.answer")}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("faq.performance.question")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                {t("faq.performance.answer")}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("faq.offline.question")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                {t("faq.offline.answer")}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
