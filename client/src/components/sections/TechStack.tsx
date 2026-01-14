import { Database, Layout, Smartphone, Cloud } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function TechStack() {
  const { t } = useTranslation();

  const stacks = [
    { icon: <Layout />, name: t("techstack.frontend"), tools: "React, Next.js, Tailwind, Vue" },
    { icon: <Database />, name: t("techstack.backend"), tools: "Node.js, Python, Go, PostgreSQL" },
    { icon: <Smartphone />, name: t("techstack.mobile"), tools: "React Native, Flutter, Swift, Kotlin" },
    { icon: <Cloud />, name: t("techstack.devops"), tools: "AWS, Docker, Kubernetes, Terraform" },
  ];

  return (
    <section className="py-20 border-y border-border bg-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stacks.map((stack, i) => (
            <div key={i} className="text-center group p-6 rounded-xl hover:bg-secondary/50 transition-colors">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-4 border border-primary/20 group-hover:bg-primary group-hover:shadow-lg transition-all duration-300">
                <div className="text-primary group-hover:text-white transition-colors w-8 h-8">
                  {stack.icon}
                </div>
              </div>
              <h3 className="font-heading font-bold text-lg mb-2 text-foreground">{stack.name}</h3>
              <p className="text-sm text-muted-foreground">{stack.tools}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
