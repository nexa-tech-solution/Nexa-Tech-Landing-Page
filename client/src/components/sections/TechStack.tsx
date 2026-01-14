import { Database, Layout, Smartphone, Cloud, Code2, Shield } from "lucide-react";

export default function TechStack() {
  const stacks = [
    { icon: <Layout />, name: "Frontend", tools: "React, Next.js, Tailwind, Vue" },
    { icon: <Database />, name: "Backend", tools: "Node.js, Python, Go, PostgreSQL" },
    { icon: <Smartphone />, name: "Mobile", tools: "React Native, Flutter, Swift, Kotlin" },
    { icon: <Cloud />, name: "DevOps", tools: "AWS, Docker, Kubernetes, Terraform" },
  ];

  return (
    <section className="py-20 border-y border-white/5 bg-white/[0.02]">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stacks.map((stack, i) => (
            <div key={i} className="text-center group">
              <div className="w-16 h-16 mx-auto bg-white/5 rounded-2xl flex items-center justify-center mb-4 border border-white/10 group-hover:border-primary/50 group-hover:bg-primary/10 transition-all">
                <div className="text-muted-foreground group-hover:text-primary transition-colors w-8 h-8">
                  {stack.icon}
                </div>
              </div>
              <h3 className="font-heading font-bold text-lg mb-2">{stack.name}</h3>
              <p className="text-sm text-muted-foreground">{stack.tools}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
