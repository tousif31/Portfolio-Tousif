import { useQuery } from "@tanstack/react-query";
import { publicApi } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Award, Medal, Tag, ExternalLink } from "lucide-react";

export default function Achievements() {
  const { data: achievements = [] } = useQuery({
    queryKey: ['/api/achievements'],
    queryFn: () => publicApi.getAchievements(),
  });

  const getIconComponent = (iconType: string) => {
    switch (iconType) {
      case 'trophy':
        return Trophy;
      case 'award':
        return Award;
      case 'medal':
        return Medal;
      case 'certificate':
        return Tag;
      default:
        return Trophy;
    }
  };

  const getIconColor = (iconType: string) => {
    switch (iconType) {
      case 'trophy':
        return 'text-yellow-400';
      case 'award':
        return 'text-orange-400';
      case 'medal':
        return 'text-purple-400';
      case 'certificate':
        return 'text-blue-400';
      default:
        return 'text-yellow-400';
    }
  };

  const getBgColor = (iconType: string) => {
    switch (iconType) {
      case 'trophy':
        return 'bg-yellow-500/20';
      case 'award':
        return 'bg-orange-500/20';
      case 'medal':
        return 'bg-purple-500/20';
      case 'certificate':
        return 'bg-blue-500/20';
      default:
        return 'bg-yellow-500/20';
    }
  };

  return (
    <section id="achievements" className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Achievements & Certifications</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto"></div>
        </div>
        
        {achievements.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => {
              const IconComponent = getIconComponent(achievement.iconType || 'trophy');
              const iconColor = getIconColor(achievement.iconType || 'trophy');
              const bgColor = getBgColor(achievement.iconType || 'trophy');
              
              return (
                <Card 
                  key={achievement.id} 
                  className="bg-slate-800/50 border-slate-700 hover:border-yellow-500/50 transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <IconComponent className={`${iconColor} w-6 h-6`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-2">
                          {achievement.title}
                        </h3>
                        <p className="text-slate-400 text-sm mb-2">
                          {achievement.issuer}
                        </p>
                        <p className="text-slate-500 text-xs mb-2">
                          Issued: {achievement.date}
                        </p>
                        {achievement.description && (
                          <p className="text-slate-400 text-sm mb-2">
                            {achievement.description}
                          </p>
                        )}
                        {achievement.certificateUrl && (
                          <a 
                            href={achievement.certificateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-blue-400 text-sm mt-2 hover:text-blue-300 transition-colors"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            View Tag
                          </a>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-slate-500">
            <p>No achievements available yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}
