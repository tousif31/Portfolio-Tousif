import { useQuery } from "@tanstack/react-query";
import { publicApi } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github } from "lucide-react";

export default function Projects() {
  const { data: projects = [] } = useQuery({
    queryKey: ['/api/projects'],
    queryFn: () => publicApi.getProjects(),
  });

  return (
    <section id="projects" className="py-20 bg-slate-800/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Featured Projects</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto"></div>
        </div>
        
        {projects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Card 
                key={project.id} 
                className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-all duration-300 hover:scale-105 overflow-hidden"
              >
                {project.imageUrl && (
                  <img 
                    src={project.imageUrl} 
                    alt={project.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">{project.title}</h3>
                  <p className="text-slate-400 mb-4">{project.description}</p>
                  
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech, index) => (
                        <Badge 
                          key={index}
                          variant="secondary" 
                          className="bg-blue-600/20 text-blue-400 text-xs"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    {project.githubUrl && (
                      <a 
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors flex items-center"
                      >
                        <Github className="w-4 h-4 mr-2" />
                        Code
                      </a>
                    )}
                    {project.liveUrl && (
                      <a 
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-400 hover:text-green-300 transition-colors flex items-center"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Live Demo
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center text-slate-500">
            <p>No projects available yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}
