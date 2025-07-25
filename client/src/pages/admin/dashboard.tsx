import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminSections from "@/components/admin/admin-sections";
import { useLocation } from "wouter";
import { 
  User, 
  ServerCog, 
  Code, 
  Trophy, 
  Mail, 
  Bot, 
  LogOut,
  Settings,
  ChevronRight,
  Shield,
  FileText
} from "lucide-react";

export default function AdminDashboard() {
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const { user, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated || !user?.isAdmin) {
      setLocation("/");
    }
  }, [isAuthenticated, user, setLocation]);

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  const handleBackToDashboard = () => {
    setCurrentSection(null);
  };

  const sections = [
    {
      id: 'intro',
      title: 'Update Introduction',
      description: 'Manage name, role, bio, and contact information',
      icon: User,
      color: 'blue',
    },
    {
      id: 'skills',
      title: 'Manage Skills',
      description: 'Add, edit, or remove technical skills and proficiencies',
      icon: ServerCog,
      color: 'green',
    },
    {
      id: 'projects',
      title: 'Manage Projects',
      description: 'Showcase your portfolio projects with details and links',
      icon: Code,
      color: 'purple',
    },
    {
      id: 'achievements',
      title: 'Manage Achievements',
      description: 'Add certifications, awards, and accomplishments',
      icon: Trophy,
      color: 'yellow',
    },
    {
      id: 'contact-messages',
      title: 'Contact Messages',
      description: 'View and manage messages from the contact form',
      icon: Mail,
      color: 'blue',
    },
    {
      id: 'ai-config',
      title: 'AI Configuration',
      description: 'Configure AI assistant settings and prompts',
      icon: Bot,
      color: 'green',
    },
    {
      id: 'socials',
      title: 'Manage Social Links',
      description: 'Add or update your GitHub, LinkedIn, Twitter, Instagram, etc.',
      icon: Settings,
      color: 'blue',
    },
  ];

  if (!isAuthenticated || !user?.isAdmin) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-8 text-center">
            <Shield className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
            <p className="text-slate-400 mb-4">You need admin privileges to access this page.</p>
            <Button onClick={() => setLocation("/")} variant="outline">
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentSection) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-50">
        <div className="container mx-auto px-4 py-8">
          <AdminSections section={currentSection} onBack={handleBackToDashboard} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-slate-400">
              Welcome back, {user?.username}! Manage your portfolio content below.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setLocation("/")}
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              View Portfolio
            </Button>
            <Button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => {
            const IconComponent = section.icon;
            return (
              <Card 
                key={section.id} 
                className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-all duration-300 hover:scale-105 cursor-pointer"
                onClick={() => setCurrentSection(section.id)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 bg-${section.color}-600/20 rounded-lg flex items-center justify-center`}>
                      <IconComponent className={`w-6 h-6 text-${section.color}-400`} />
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="text-lg font-semibold mb-2 text-white">
                    {section.title}
                  </h3>
                  <p className="text-slate-400 text-sm">
                    {section.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Quick Overview</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-blue-400 mb-1">Dashboard</div>
                <div className="text-slate-400 text-sm">Status: Active</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">Portfolio</div>
                <div className="text-slate-400 text-sm">Live & Updated</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-purple-400 mb-1">AI Assistant</div>
                <div className="text-slate-400 text-sm">Ready to Help</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-1">Contact</div>
                <div className="text-slate-400 text-sm">Form Active</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
