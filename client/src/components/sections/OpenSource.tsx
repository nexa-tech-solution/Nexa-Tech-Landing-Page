import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Github, Star, GitFork, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

const repos = [
  {
    name: "react-native-simple-fs",
    description: "A React Native filesystem repository focused on simple file access and storage workflows for mobile apps.",
    stars: null,
    forks: null,
    contributors: null,
    url: "https://github.com/tankhang1/react-native-simple-fs"
  }
];

export default function OpenSource() {
  const { t } = useTranslation();

  return (
    <section id="opensource" className="py-24 bg-gradient-to-b from-secondary/20 to-secondary/50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4 text-foreground">
              {t("opensource.title_prefix")} <span className="text-primary">{t("opensource.title_highlight")}</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              {t("opensource.description")}
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="gap-2 border-border bg-background hover:bg-secondary text-foreground"
          >
            <a
              href="https://github.com/tankhang1/react-native-simple-fs"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="w-4 h-4" />
              {t("opensource.cta")}
            </a>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {repos.map((repo, i) => (
            <Card key={i} className="bg-card border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Github className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                  {repo.contributors ? (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="w-3 h-3" />
                      <span>{repo.contributors}</span>
                    </div>
                  ) : null}
                </div>
                <CardTitle className="font-mono text-xl text-primary">{repo.name}</CardTitle>
                <CardDescription className="line-clamp-2 h-10 text-muted-foreground">{repo.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
                  <div className="flex gap-4">
                    {repo.stars ? (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>{repo.stars}</span>
                      </div>
                    ) : null}
                    {repo.forks ? (
                      <div className="flex items-center gap-1">
                        <GitFork className="w-4 h-4" />
                        <span>{repo.forks}</span>
                      </div>
                    ) : null}
                  </div>
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="gap-2 px-0 text-primary hover:bg-transparent hover:text-primary/80"
                  >
                    <a href={repo.url} target="_blank" rel="noopener noreferrer">
                      <span>View Repo</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
