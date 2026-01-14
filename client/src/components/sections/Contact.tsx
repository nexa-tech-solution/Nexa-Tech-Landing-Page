import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Mail, MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Contact() {
  const { t } = useTranslation();

  return (
    <section id="contact" className="py-24 bg-secondary/20">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6 text-foreground">
                {t("contact.title_prefix")} <span className="text-primary">{t("contact.title_highlight")}</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                {t("contact.description")}
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary shadow-sm">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">{t("contact.email")}</h4>
                    <p className="text-muted-foreground">hello@nexa.dev</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary shadow-sm">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">{t("contact.community")}</h4>
                    <p className="text-muted-foreground">Join our Discord</p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="bg-card border-border p-6 shadow-xl">
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">{t("contact.form.name")}</label>
                    <Input placeholder="John Doe" className="bg-background border-border" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">{t("contact.form.email")}</label>
                    <Input placeholder="john@example.com" className="bg-background border-border" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">{t("contact.form.subject")}</label>
                  <Input placeholder={t("contact.form.subject") + "..."} className="bg-background border-border" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">{t("contact.form.message")}</label>
                  <Textarea placeholder={t("contact.form.message") + "..."} className="bg-background border-border min-h-[120px]" />
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 shadow-md">
                  {t("contact.form.submit")}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
