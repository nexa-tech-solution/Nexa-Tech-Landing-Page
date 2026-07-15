import { Menu, X } from 'lucide-react';

type MobileMenuButtonProps = {
  menuOpen: boolean;
  onToggle: () => void;
};

export default function MobileMenuButton({ menuOpen, onToggle }: MobileMenuButtonProps) {
  return (
    <button
      onClick={onToggle}
      className="lg:hidden relative flex items-center justify-center w-10 h-10 rounded-full bg-white/70 backdrop-blur-md border border-white/60 text-ink transition-all duration-300 hover:bg-white/90"
      aria-label={menuOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={menuOpen}
    >
      <Menu
        className={`w-5 h-5 absolute transition-all duration-300 ${
          menuOpen ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
        }`}
      />
      <X
        className={`w-5 h-5 absolute transition-all duration-300 ${
          menuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
        }`}
      />
    </button>
  );
}
