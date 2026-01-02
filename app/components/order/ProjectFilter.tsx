import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Clock } from 'lucide-react';
import { cn } from '~/lib/utils';

interface Project {
  id: string;
  name: string;
  category: string;
  description: string;
  colors: string[];
  delivery_time: string;
  tags: string[];
}

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface ProjectFilterProps {
  projects: Project[];
  tags: Tag[];
  selectedTagIds: string[];
}

export function ProjectFilter({ projects, tags, selectedTagIds }: ProjectFilterProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Filter projects based on selected tags
  const filteredProjects = useMemo(() => {
    if (selectedTagIds.length === 0) {
      return projects.slice(0, 6); // Show first 6 if no filter
    }
    
    return projects.filter(project => 
      selectedTagIds.some(tagId => project.tags.includes(tagId))
    ).slice(0, 6);
  }, [projects, selectedTagIds]);

  // Get tag objects for display
  const getProjectTags = (project: Project) => {
    return project.tags
      .map(tagId => tags.find(t => t.id === tagId))
      .filter(Boolean) as Tag[];
  };

  if (filteredProjects.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Aucun projet ne correspond à votre sélection.</p>
        <p className="text-sm mt-2">Essayez de modifier vos critères.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Projets similaires
        </label>
        <span className="text-sm text-gray-500">
          {filteredProjects.length} projet{filteredProjects.length > 1 ? 's' : ''}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="group relative"
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className={cn(
                "overflow-hidden rounded-xl border-2 transition-all duration-300",
                hoveredId === project.id 
                  ? "border-[var(--accent)] shadow-lg" 
                  : "border-gray-200"
              )}>
                {/* Preview */}
                <div 
                  className="aspect-video flex items-center justify-center p-6"
                  style={{ 
                    background: `linear-gradient(135deg, ${project.colors[0]} 0%, ${project.colors[1] || project.colors[0]} 100%)` 
                  }}
                >
                  <div className="text-center text-white">
                    <h4 className="font-bold text-lg">{project.name}</h4>
                    <p className="text-sm opacity-80">{project.category}</p>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 bg-white">
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {project.description}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {getProjectTags(project).slice(0, 3).map(tag => (
                      <span
                        key={tag.id}
                        className="inline-block px-2 py-0.5 rounded-full text-xs text-white"
                        style={{ backgroundColor: tag.color }}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Livré en {project.delivery_time}</span>
                    </div>
                    <button className="flex items-center gap-1 text-[var(--accent)] hover:underline">
                      <ExternalLink className="w-3 h-3" />
                      Voir
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}



