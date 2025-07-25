import { useQuery } from "@tanstack/react-query";
import { publicApi } from "@/lib/api";
import { Badge } from "@/components/ui/badge";

export default function About() {
  const { data: introduction } = useQuery({
    queryKey: ['/api/introduction'],
    queryFn: () => publicApi.getIntroduction(),
  });

  return (
    <section id="about" className="py-20 bg-slate-800/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">About Me</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto"></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-blue-400">Who I Am</h3>
            <div className="space-y-6">
              {introduction?.detailedBio ? (
                <p className="text-slate-300 leading-relaxed">
                  {introduction.detailedBio}
                </p>
              ) : (
                <>
                  <p className="text-slate-300 leading-relaxed">
                    I'm a passionate full-stack developer with expertise in modern web technologies and a deep interest in artificial intelligence. My journey in technology started with curiosity about how things work, which led me to pursue software development and explore cutting-edge technologies.
                  </p>
                  <p className="text-slate-300 leading-relaxed">
                    With experience in React, Node.js, Python, and cloud platforms, I enjoy building scalable applications that solve real-world problems. I'm particularly interested in integrating AI capabilities into web applications to create more intelligent and user-friendly experiences.
                  </p>
                </>
              )}
            </div>
            <div className="flex flex-wrap gap-3 mt-6">
              <Badge variant="secondary" className="bg-blue-600/20 text-blue-400 hover:bg-blue-600/30">
                Problem Solver
              </Badge>
              <Badge variant="secondary" className="bg-purple-600/20 text-purple-400 hover:bg-purple-600/30">
                AI Enthusiast
              </Badge>
              <Badge variant="secondary" className="bg-green-600/20 text-green-400 hover:bg-green-600/30">
                Team Player
              </Badge>
              <Badge variant="secondary" className="bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30">
                Continuous Learner
              </Badge>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="Coding workspace" 
              className="rounded-xl shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent rounded-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
