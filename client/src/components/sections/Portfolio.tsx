import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ExternalLink, Github, Smartphone, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const projects = {
  web: [
    {
      title: "NexaFlow Dashboard",
      desc: "A real-time analytics dashboard for SaaS platforms with data visualization.",
      tech: ["React", "D3.js", "Node.js"],
      link: "#",
      repo: "#"
    },
    {
      title: "DocuShare Pro",
      desc: "Secure document sharing platform with end-to-end encryption.",
      tech: ["Next.js", "PostgreSQL", "AWS S3"],
      link: "#",
      repo: "#"
    },
    {
      title: "E-Commerce Starter",
      desc: "Headless e-commerce template optimized for high performance.",
      tech: ["Remix", "Shopify API", "Tailwind"],
      link: "#",
      repo: "#"
    }
  ],
  mobile: [
    {
      title: "FitTrack Mate",
      desc: "Personal workout and nutrition tracking app with social features.",
      tech: ["React Native", "Firebase", "Redux"],
      store: { android: "#", ios: "#" }
    },
    {
      title: "CryptoWallet X",
      desc: "Secure mobile wallet for managing digital assets on the go.",
      tech: ["Flutter", "Dart", "Blockchain"],
      store: { android: "#", ios: "#" }
    }
  ]
};

export default function Portfolio() {
  const { t } = useTranslation();

  return (
    <section id="products" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4 text-foreground">
            {t("products.title_prefix")} <span className="text-primary">{t("products.title_highlight")}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("products.description")}
          </p>
        </div>

        <Tabs defaultValue="web" className="w-full max-w-5xl mx-auto">
          <div className="flex justify-center mb-12">
            <TabsList className="grid w-full max-w-md grid-cols-2 bg-secondary border border-border p-1">
              <TabsTrigger value="web" className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-300">
                {t("products.tabs.web")}
              </TabsTrigger>
              <TabsTrigger value="mobile" className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-300">
                {t("products.tabs.mobile")}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="web" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.web.map((project, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="h-full bg-card border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 flex flex-col group">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                        <Globe className="text-blue-600 w-6 h-6" />
                      </div>
                      <CardTitle className="text-foreground">{project.title}</CardTitle>
                      <CardDescription className="text-muted-foreground">{project.desc}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map(t => (
                          <Badge key={t} variant="secondary" className="bg-secondary text-secondary-foreground hover:bg-secondary/80">{t}</Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-4">
                      <Button variant="outline" size="sm" className="w-full gap-2 border-border hover:bg-secondary text-foreground">
                        <ExternalLink className="w-4 h-4" /> {t("products.buttons.demo")}
                      </Button>
                      <Button variant="ghost" size="icon" className="border border-border hover:bg-secondary text-foreground">
                        <Github className="w-4 h-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="mobile" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.mobile.map((project, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="h-full bg-card border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 group">
                    <div className="flex flex-col md:flex-row h-full">
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                          <Smartphone className="text-green-600 w-6 h-6" />
                        </div>
                        <CardTitle className="mb-2 text-foreground">{project.title}</CardTitle>
                        <CardDescription className="mb-4 text-muted-foreground">{project.desc}</CardDescription>
                        
                        <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                          {project.tech.map(t => (
                            <Badge key={t} variant="secondary" className="bg-secondary text-secondary-foreground hover:bg-secondary/80">{t}</Badge>
                          ))}
                        </div>
                        
                        <div className="flex gap-4 mt-auto pt-4 border-t border-border">
                          <Button variant="outline" size="sm" className="flex-1 gap-2 border-border hover:bg-secondary text-foreground">
                            {t("products.buttons.play")}
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1 gap-2 border-border hover:bg-secondary text-foreground">
                            {t("products.buttons.store")}
                          </Button>
                        </div>
                      </div>
                      <div className="bg-secondary/30 md:w-48 p-4 flex items-center justify-center border-l border-border">
                        {/* Placeholder for App Screen */}
                        <div className="w-32 h-56 bg-background rounded-xl border border-border flex items-center justify-center shadow-inner">
                          <span className="text-xs text-muted-foreground">App Screen</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
