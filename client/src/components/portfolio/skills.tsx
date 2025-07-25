import { useQuery } from "@tanstack/react-query";
import { publicApi } from "@/lib/api";
import { Monitor, Server, Wrench } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Skills() {
  const { data: skills = [] } = useQuery({
    queryKey: ['/api/skills'],
    queryFn: () => publicApi.getSkills(),
  });

  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  const categoryConfig = {
    frontend: {
      title: "Frontend",
      icon: Monitor,
      color: "blue",
    },
    backend: {
      title: "Backend", 
      icon: Server,
      color: "green",
    },
    tools: {
      title: "Tools & Others",
      icon: Wrench,
      color: "purple",
    },
  };

  return (
    <section id="skills" className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Skills & Technologies</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto"></div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {Object.entries(categoryConfig).map(([key, config]) => {
            const categorySkills = skillsByCategory[key] || [];
            const Icon = config.icon;
            
            return (
              <Card key={key} className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all duration-300">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 bg-${config.color}-600/20 rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <Icon className={`text-${config.color}-400 w-8 h-8`} />
                    </div>
                    <h3 className={`text-xl font-semibold text-${config.color}-400`}>
                      {config.title}
                    </h3>
                  </div>
                  
                  {categorySkills.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                      {categorySkills.map((skill) => (
                        <div key={skill.id} className="text-center">
                          {skill.iconUrl ? (
                            <img 
                              src={skill.iconUrl} 
                              alt={skill.name}
                              className="w-8 h-8 mx-auto mb-2"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-slate-600 rounded mx-auto mb-2 flex items-center justify-center">
                              <span className="text-xs font-bold">
                                {skill.name.substring(0, 2).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <p className="text-sm text-slate-300">{skill.name}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-slate-500">
                      <p className="text-sm">No skills added yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
