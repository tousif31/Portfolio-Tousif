import { useState } from "react";
import Navbar from "@/components/portfolio/navbar";
import Hero from "@/components/portfolio/hero";
import About from "@/components/portfolio/about";
import Skills from "@/components/portfolio/skills";
import Projects from "@/components/portfolio/projects";
import Achievements from "@/components/portfolio/achievements";
import Contact from "@/components/portfolio/contact";
import AIChatbot from "@/components/ai-chatbot";
import AdminLogin from "@/pages/admin/login";
import fs from 'fs';
import path from 'path';

export default function Home() {
  const [showAdminModal, setShowAdminModal] = useState(false);

  const handleAdminClick = () => {
    setShowAdminModal(true);
  };

  const handleAdminClose = () => {
    setShowAdminModal(false);
  };

  const handleAdminSuccess = () => {
    setShowAdminModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 overflow-x-hidden">
      <Navbar onAdminClick={handleAdminClick} />
      
      <main className="pt-16">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Achievements />
        <Contact />
      </main>
      <AIChatbot />

      {showAdminModal && (
        <AdminLogin
          onSuccess={handleAdminSuccess}
          onClose={handleAdminClose}
        />
      )}
    </div>
  );
}
