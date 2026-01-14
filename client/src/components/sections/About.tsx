import { Code, Server, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function About() {
  return (
    <section id="about" className="py-24 bg-background/50 border-y border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              Engineering with <span className="text-primary">Purpose</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              At Nexa, we believe in transparency and quality. We are a team of developers, designers, and open-source enthusiasts dedicated to building tools that solve real problems.
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Whether it's a high-scale web platform or a native mobile application, we bring a developer-first mindset to every project we touch.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {[
              {
                icon: <Code className="w-6 h-6 text-primary" />,
                title: "Developer-First Mindset",
                desc: "We build with clean architecture and maintainability in mind."
              },
              {
                icon: <Server className="w-6 h-6 text-primary" />,
                title: "Scalable Systems",
                desc: "Our solutions are designed to grow with your user base."
              },
              {
                icon: <Users className="w-6 h-6 text-primary" />,
                title: "Community Driven",
                desc: "We actively contribute back to the open-source ecosystem."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4 p-4 rounded-lg bg-white/5 border border-white/10 hover:border-primary/50 transition-colors"
              >
                <div className="mt-1">{item.icon}</div>
                <div>
                  <h3 className="font-bold mb-1">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
