import { Github, Linkedin, Twitter } from "lucide-react";
import logoImg from "@assets/logo-CJsuXJSw_1768365608404.jpg";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-background border-t border-border py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img 
                src={logoImg} 
                alt="Nexa Tech" 
                className="w-8 h-8 rounded-md object-cover shadow-sm"
              />
              <span className="text-xl font-heading font-bold text-foreground">Nexa Tech</span>
            </div>
            <p className="text-muted-foreground max-w-sm">
              {t("footer.description")}
            </p>
          </div>

          <div>
            <h4 className="font-heading font-bold mb-4 text-foreground">{t("footer.links")}</h4>
            <ul className="space-y-2">
              <li><a href="#products" className="text-muted-foreground hover:text-primary transition-colors">{t("nav.products")}</a></li>
              <li><a href="#opensource" className="text-muted-foreground hover:text-primary transition-colors">{t("nav.opensource")}</a></li>
              <li><a href="#team" className="text-muted-foreground hover:text-primary transition-colors">{t("nav.team")}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold mb-4 text-foreground">{t("footer.connect")}</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Nexa Tech. {t("footer.rights")}</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary">{t("footer.privacy")}</a>
            <a href="#" className="hover:text-primary">{t("footer.terms")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
