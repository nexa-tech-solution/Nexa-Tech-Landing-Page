import { Github, Linkedin, Twitter } from "lucide-react";
import logoImg from "@assets/logo-CJsuXJSw_1768365608404.jpg";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-white/10 py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img 
                src={logoImg} 
                alt="Nexa Tech" 
                className="w-8 h-8 rounded-md object-cover"
              />
              <span className="text-xl font-heading font-bold">Nexa Tech</span>
            </div>
            <p className="text-muted-foreground max-w-sm">
              Building high-quality open-source software, scalable web
              platforms, and production-ready mobile apps used by real users.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-bold mb-4">Links</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="text-muted-foreground hover:text-primary transition-colors">Home</a></li>
              <li><a href="#products" className="text-muted-foreground hover:text-primary transition-colors">Products</a></li>
              <li><a href="#opensource" className="text-muted-foreground hover:text-primary transition-colors">Open Source</a></li>
              <li><a href="#team" className="text-muted-foreground hover:text-primary transition-colors">Team</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold mb-4">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Nexa Tech. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary">Privacy Policy</a>
            <a href="#" className="hover:text-primary">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
