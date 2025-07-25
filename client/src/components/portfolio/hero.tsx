import { useQuery } from "@tanstack/react-query";
import { publicApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Instagram, Twitter } from "lucide-react";

export default function Hero() {
  const { data: introduction } = useQuery({
    queryKey: ['/api/introduction'],
    queryFn: () => publicApi.getIntroduction(),
  });

  const { data: socials } = useQuery({
    queryKey: ['/api/socials'],
    queryFn: () => publicApi.getSocials(),
  });

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-slate-900"></div>
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          {/* Profile Picture */}
          <div className="mx-auto w-48 h-48 rounded-full overflow-hidden border-4 border-blue-500/30 mb-8 shadow-2xl">
            <img 
              src={introduction?.profileImageUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"} 
              alt={`${introduction?.name || 'Profile'} Picture`} 
              className="w-full h-full object-cover" 
            />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
            {introduction?.name || "Loading..."}
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-8">
            {introduction?.role || "Developer"} 
            {introduction?.specialty && (
              <> & {introduction.specialty}</>
            )}
          </p>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            {introduction?.bio || "Loading bio..."}
          </p>
          
          {/* Social Links */}
          <div className="flex justify-center space-x-6 mb-12">
            {socials?.github && (
              <a 
                href={socials.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-slate-800 hover:bg-slate-700 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Github className="w-6 h-6" />
              </a>
            )}
            {socials?.linkedin && (
              <a 
                href={socials.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-slate-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Linkedin className="w-6 h-6" />
              </a>
            )}
            {socials?.instagram && (
              <a 
                href={socials.instagram} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-slate-800 hover:bg-pink-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Instagram className="w-6 h-6" />
              </a>
            )}
            {socials?.twitter && (
              <a 
                href={socials.twitter} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-slate-800 hover:bg-blue-400 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Twitter className="w-6 h-6" />
              </a>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => scrollToSection('contact')}
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Get In Touch
            </Button>
            <Button
              variant="outline"
              onClick={() => scrollToSection('projects')}
              className="border-slate-600 hover:border-slate-500 px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-slate-800"
            >
              View My Work
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
