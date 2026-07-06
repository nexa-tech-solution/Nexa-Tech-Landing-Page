import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ExternalLink, Github, Smartphone, Globe, Puzzle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const projects = {
  web: [
    {
      title: "The Home Versus",
      desc: "Expert home-product comparison site with editorial-style reviews and side-by-side recommendations for real households.",
      tech: ["React", "Next.js"],
      link: "https://thehomeversus.com/",
      repo: "https://github.com/nexa-tech-solution/the-home-versus",
    },
    {
      title: "Mystic Tarot",
      desc: "Discover yourself and listen to the messages from the universe.",
      tech: ["React", "Tailwind", "Node.js"],
      link: "https://tarrot-web-app.vercel.app/",
      repo: "",
    },
    {
      title: "PetPal | Pet Simulator",
      desc: "🐾 PetPal — Chat with your virtual pet!",
      tech: ["Next.js", "Gemini", "Rive"],
      link: "https://pet-simulator-sigma.vercel.app/",
      repo: "",
    },
    {
      title: "Resize Image",
      desc: "Free browser-based image tool for resizing, compressing, and converting images quickly.",
      tech: ["Web Tool", "Image Processing"],
      link: "https://resizeimage.tech/",
      repo: "",
    },
    {
      title: "Time Converter",
      desc: "Quickly convert time across zones and cities to schedule meetings, travel, and global work without confusion.",
      tech: ["React", "Tool"],
      link: "https://time-converter-woad-iota.vercel.app/",
    },
  ],
  mobile: [
    {
      title: "Tarot Destiny: Daily Reading",
      desc: "🔮 Tarot Destiny: Self-Discovery & AI Guidance",
      tech: ["React Native", "React", "Redux"],
      store: {
        android:
          "https://play.google.com/store/apps/details?id=com.nexa_tarrot_app",
        ios: "#",
      },
      image: "/product-images/tarot-destiny.png",
    },
    {
      title: "PetPal - Pet Simulator",
      desc: "🐾 PetPal — Chat with your virtual pet!",
      tech: ["React Native", "React", "Gemini"],
      store: {
        android:
          "https://play.google.com/store/apps/details?id=com.pet_simulator",
        ios: "#",
      },
      image: "/product-images/petpal.webp",
    },
    {
      title: "ScanQR - QR Code & Barcode",
      desc: "ScanQR is the all-in-one tool that meets all your scanning needs.",
      tech: ["React Native", "Vision Camera", "QR Kit"],
      store: {
        android:
          "https://play.google.com/store/apps/details?id=com.nexa.qr_code",
        ios: "https://apps.apple.com/us/app/scanqr-qr-code-barcode/id6779862851",
      },
      image: "/product-images/scanqr.webp",
    },
    {
      title: "Maths Calc - Learn & Solve",
      desc: "Are you ready to stop struggling with math? Maths Calc - Learn & Solve is the complete, all-in-one tool that goes beyond simple answers",
      tech: ["React Native", "Math", "Calculator"],
      store: {
        android:
          "https://play.google.com/store/apps/details?id=com.nexa.easy_math_calculator",
        ios: "#",
      },
      image: "/product-images/maths-calc.webp",
    },
    {
      title: "Smart Currency Converter",
      desc: `Tired of guessing foreign exchange rates? ☕💵
Get acquainted with Smart Currency Converter, the ultimate currency app for fast and accurate currency conversion, exchange rate tracking, and offline currency calculations. 🌍
`,
      tech: ["React Native", "Currency", "Global"],
      store: {
        android:
          "https://play.google.com/store/apps/details?id=com.currencyunitconverter",
        ios: "https://apps.apple.com/us/app/currency-unit-converter/id6780219094",
      },
      image: "/product-images/currency-converter.webp",
    },
    {
      title: "Loan Estimator",
      desc: "Loan calculation tool for estimating payments and exporting loan calculation reports.",
      tech: ["React Native", "Finance", "Calculator"],
      store: {
        android:
          "https://play.google.com/store/apps/details?id=com.nexa.loan.estimator",
        ios: "https://apps.apple.com/us/app/easy-loan-estimator/id6779272088",
      },
      image: "/product-images/loan-estimator.webp",
    },
    {
      title: "Time Converter",
      desc: "Quickly convert time across zones and cities to schedule meetings, travel, and global work without confusion.",
      tech: ["React", "Tool"],
      store: {
        android:
          "https://play.google.com/store/apps/details?id=nexa.timeconverter.com",
        ios: "https://apps.apple.com/us/app/time-converter-world-clock/id6780116305",
      },
      image: "/product-images/time-converter.png",
    },
    {
      title: "Quick Image PDF Resizer",
      desc: "Quick Image PDF Resizer is a fast, private, browser-based tool for resizing images, compressing files, converting formats, and handling common PDF tasks. It is designed for people who want simple results without complicated editing software.",
      tech: ["React", "React Native", "PDF", "Tool"],
      store: {
        android:
          "https://play.google.com/store/apps/details?id=com.nexa.pdfresizer",
        ios: "https://apps.apple.com/us/app/quick-image-pdf-resizer/id6780742651",
      },
      image: "/product-images/quick-pdf-image-resizer.webp",
    },
  ],
  chrome: [
    {
      title: "Time Converter",
      desc: "Chrome extension for checking and comparing time zones quickly while planning meetings across regions.",
      tech: ["Chrome Extension", "Productivity", "Time Zones"],
      link: "https://chromewebstore.google.com/detail/world-time-buddy/mmlplefhfbacmbebleofnfligokkaljh",
      repo: "",
    },
  ],
};

export default function Portfolio() {
  const { t } = useTranslation();

  return (
    <section id="products" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4 text-foreground">
            {t("products.title_prefix")}{" "}
            <span className="text-primary">
              {t("products.title_highlight")}
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("products.description")}
          </p>
        </div>

        <Tabs defaultValue="web" className="w-full max-w-5xl mx-auto">
          <div className="flex justify-center mb-12">
            <TabsList className="grid w-full max-w-lg grid-cols-3 bg-secondary border border-border p-1">
              <TabsTrigger
                value="web"
                className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-300"
              >
                {t("products.tabs.web")}
              </TabsTrigger>
              <TabsTrigger
                value="mobile"
                className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-300"
              >
                {t("products.tabs.mobile")}
              </TabsTrigger>
              <TabsTrigger
                value="chrome"
                className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-300"
              >
                {t("products.tabs.chrome")}
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
                      <CardTitle className="text-foreground">
                        {project.title}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        {project.desc}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((t) => (
                          <Badge
                            key={t}
                            variant="secondary"
                            className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          >
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-4">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="w-full gap-2 border-border hover:bg-secondary text-foreground"
                      >
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4" />{" "}
                          {t("products.buttons.demo")}
                        </a>
                      </Button>
                      {project.repo ? (
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          className="border border-border hover:bg-secondary text-foreground"
                        >
                          <a
                            href={project.repo}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${project.title} GitHub repository`}
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="border border-border hover:bg-secondary text-foreground"
                          disabled
                          aria-label={`${project.title} GitHub repository unavailable`}
                        >
                          <Github className="w-4 h-4" />
                        </Button>
                      )}
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
                        <a
                          href={project.store.android}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                            <Smartphone className="text-green-600 w-6 h-6" />
                          </div>
                        </a>
                        <CardTitle className="mb-2 text-foreground">
                          {project.title}
                        </CardTitle>
                        <CardDescription className="mb-4 text-muted-foreground">
                          {project.desc}
                        </CardDescription>

                        <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                          {project.tech.map((t) => (
                            <Badge
                              key={t}
                              variant="secondary"
                              className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
                            >
                              {t}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex gap-4 mt-auto pt-4 border-t border-border">
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="flex-1 gap-2 border-border hover:bg-secondary text-foreground"
                          >
                            <a
                              href={project.store.android}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {t("products.buttons.play")}
                            </a>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={project.store.ios?.includes("#")}
                            className="flex-1 gap-2 border-border hover:bg-secondary text-foreground"
                          >
                            <a
                              href={project.store.ios}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {t("products.buttons.store")}
                            </a>
                          </Button>
                        </div>
                      </div>
                      <div className="bg-secondary/30 md:w-48 p-4 flex items-center justify-center border-l border-border">
                        {project.image ? (
                          <img
                            src={project.image}
                            alt={project.title}
                            width="128"
                            height="228"
                            loading="lazy"
                            decoding="async"
                            className="w-32 h-auto rounded-xl border border-border shadow-md object-cover"
                          />
                        ) : (
                          <div className="w-32 h-56 bg-background rounded-xl border border-border flex items-center justify-center shadow-inner">
                            <span className="text-xs text-muted-foreground">
                              App Screen
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="chrome" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.chrome.map((project, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="h-full bg-card border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 flex flex-col group">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
                        <Puzzle className="text-amber-600 w-6 h-6" />
                      </div>
                      <CardTitle className="text-foreground">
                        {project.title}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        {project.desc}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((t) => (
                          <Badge
                            key={t}
                            variant="secondary"
                            className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          >
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-4">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="w-full gap-2 border-border hover:bg-secondary text-foreground"
                      >
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4" />{" "}
                          {t("products.buttons.chrome")}
                        </a>
                      </Button>
                    </CardFooter>
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
