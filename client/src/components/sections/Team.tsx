import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Github, Linkedin } from "lucide-react";
import { useTranslation } from "react-i18next";

const team = [
  {
    name: "Ethan",
    role: "Tech Lead, Mobile, Web Developer",
    bio: "Core Values: Integrity, Innovation, Teamwork, and Excellence.",
    initials: "E",
    link: "https://avatars.githubusercontent.com/u/74121720?s=400&u=07748c62de3b2038835d7604df19538ef6d9c9e1&v=4",
    github: "https://github.com/tankhang1",
    linkedin: "https://www.linkedin.com/in/khang-doan-373898264/",
  },
  {
    name: "Tina",
    role: "Team Lead, Mobile, Web Developer",
    bio: "Passionate about leading teams to build scalable, user-centric mobile and web applications.",
    initials: "T",
    link: "https://avatars.githubusercontent.com/u/114568554?v=4",
    github: "https://github.com/Tien25012003",
    linkedin: "https://www.linkedin.com/in/tien-nguyen-2aa5a927b/",
  },
];

export default function Team() {
  const { t } = useTranslation();

  return (
    <section id="team" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4 text-foreground">
            {t("team.title_prefix")}{" "}
            <span className="text-primary">{t("team.title_highlight")}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("team.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, i) => (
            <Card
              key={i}
              className="bg-transparent border-0 shadow-none text-center"
            >
              <CardContent className="pt-6">
                <Avatar className="w-32 h-32 mx-auto mb-6 border-4 border-white shadow-lg">
                  <AvatarImage src={member.link} />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                    {member.initials}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-heading font-bold text-xl mb-1 text-foreground">
                  {member.name}
                </h3>
                <p className="text-primary text-sm font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-muted-foreground text-sm mb-6">
                  {member.bio}
                </p>
                <div className="flex justify-center gap-4">
                  <a
                    href={member.github}
                    target="_blank"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
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
