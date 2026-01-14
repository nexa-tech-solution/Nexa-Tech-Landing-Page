import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Github, Linkedin } from "lucide-react";
import { useTranslation } from "react-i18next";

const team = [
  {
    name: "Alex Rivera",
    role: "Lead Architect",
    bio: "Full-stack wizard with 10+ years of experience in distributed systems.",
    initials: "AR"
  },
  {
    name: "Sarah Chen",
    role: "Product Designer",
    bio: "Obsessed with pixel perfection and intuitive user experiences.",
    initials: "SC"
  },
  {
    name: "Marcus Johnson",
    role: "Mobile Lead",
    bio: "Specialist in high-performance native and cross-platform mobile apps.",
    initials: "MJ"
  },
  {
    name: "Elena Ivanova",
    role: "DevOps Engineer",
    bio: "Keeping our infrastructure resilient, secure, and scalable.",
    initials: "EI"
  }
];

export default function Team() {
  const { t } = useTranslation();

  return (
    <section id="team" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4 text-foreground">
            {t("team.title_prefix")} <span className="text-primary">{t("team.title_highlight")}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("team.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, i) => (
            <Card key={i} className="bg-transparent border-0 shadow-none text-center">
              <CardContent className="pt-6">
                <Avatar className="w-32 h-32 mx-auto mb-6 border-4 border-white shadow-lg">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                    {member.initials}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-heading font-bold text-xl mb-1 text-foreground">{member.name}</h3>
                <p className="text-primary text-sm font-medium mb-3">{member.role}</p>
                <p className="text-muted-foreground text-sm mb-6">{member.bio}</p>
                <div className="flex justify-center gap-4">
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    <Github className="w-5 h-5" />
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
