import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Star, GitFork, Users } from "lucide-react";

const repos = [
  {
    name: "nexa-ui-kit",
    description: "A comprehensive React UI kit for building dashboard interfaces quickly.",
    stars: 1240,
    forks: 340,
    contributors: 45
  },
  {
    name: "fast-logger-js",
    description: "Zero-dependency, high-performance logging library for Node.js services.",
    stars: 890,
    forks: 120,
    contributors: 23
  },
  {
    name: "native-bridge-core",
    description: "Core utilities for bridging React Native with native iOS/Android modules.",
    stars: 560,
    forks: 85,
    contributors: 12
  }
];

export default function OpenSource() {
  return (
    <section id="opensource" className="py-24 bg-gradient-to-b from-background to-black/20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">Open Source <span className="text-primary">DNA</span></h2>
            <p className="text-muted-foreground text-lg">
              We don't just use open source software; we build it. Check out some of our most popular repositories.
            </p>
          </div>
          <Button variant="outline" className="gap-2 border-white/20">
            <Github className="w-4 h-4" />
            View GitHub Org
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {repos.map((repo, i) => (
            <Card key={i} className="bg-black/40 border-white/10 hover:border-primary/40 transition-all group">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Github className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="w-3 h-3" />
                    <span>{repo.contributors}</span>
                  </div>
                </div>
                <CardTitle className="font-mono text-xl text-primary">{repo.name}</CardTitle>
                <CardDescription className="line-clamp-2 h-10">{repo.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500/80" />
                    <span>{repo.stars}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GitFork className="w-4 h-4" />
                    <span>{repo.forks}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
