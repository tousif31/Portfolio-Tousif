import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Shield, Home, User, Settings, Code, Trophy, Mail, Layers } from "lucide-react";
import { Link } from "wouter";

interface NavbarProps {
  onAdminClick: () => void;
}

export default function Navbar({ onAdminClick }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "#home", icon: <Home className="w-6 h-6" /> },
    { label: "About", href: "#about", icon: <User className="w-6 h-6" /> },
    { label: "Skills", href: "#skills", icon: <Layers className="w-6 h-6" /> },
    { label: "Projects", href: "#projects", icon: <Code className="w-6 h-6" /> },
    { label: "Achievements", href: "#achievements", icon: <Trophy className="w-6 h-6" /> },
    { label: "Contact", href: "#contact", icon: <Mail className="w-6 h-6" /> },
  ];

  const scrollToSection = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Mobile: Hamburger left, Admin right */}
          <div className="flex flex-1 items-center justify-between md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-400 hover:text-white p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              style={{ minWidth: 44, minHeight: 44 }}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
            {/* Optionally, place a logo or title here for center alignment */}
            <div />
            <div className="flex relative group">
              <Button
                onClick={onAdminClick}
                className="rounded-full w-10 h-10 p-0 flex items-center justify-center bg-purple-600 hover:bg-purple-700"
                aria-label="Admin"
              >
                <Shield className="w-5 h-5" />
              </Button>
              {/* Tooltip: only visible on desktop */}
              <span className="hidden md:block absolute left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded bg-slate-800 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                Admin
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.href)}
                  className="text-slate-300 hover:text-white p-2 md:p-3 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                  aria-label={item.label}
                  style={{ minWidth: 44, minHeight: 44 }}
                >
                  {/* Responsive icon size */}
                  <span className="block w-5 h-5 md:w-6 md:h-6">
                    {item.icon}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Desktop: Admin Button & Hamburger hidden */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex relative group">
              <Button
                onClick={onAdminClick}
                className="rounded-full w-10 h-10 p-0 flex items-center justify-center bg-purple-600 hover:bg-purple-700"
                aria-label="Admin"
              >
                <Shield className="w-5 h-5" />
              </Button>
              <span className="hidden md:block absolute left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded bg-slate-800 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                Admin
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700">
          <div className="px-2 pt-2 pb-3 flex flex-col items-center gap-2">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.href)}
                className="text-slate-300 hover:text-white p-3 rounded-full w-full flex items-center justify-center text-base transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                aria-label={item.label}
                style={{ minHeight: 44 }}
              >
                <span className="block w-5 h-5 mr-2">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
            <Button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onAdminClick();
              }}
              className="w-full text-left bg-purple-600 hover:bg-purple-700 px-3 py-3 rounded text-base font-medium transition-colors flex items-center justify-center mt-2"
              style={{ minHeight: 44 }}
            >
              <Shield className="w-5 h-5 mr-2" />
              Admin Access
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
