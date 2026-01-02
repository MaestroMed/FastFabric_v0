import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
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
  category: string;
}

interface ProjectsCarouselProps {
  projects: Project[];
  tags: Tag[];
}

export function ProjectsCarousel({ projects, tags }: ProjectsCarouselProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter projects
  const filteredProjects = useMemo(() => {
    if (!selectedTag) return projects;
    return projects.filter(p => p.tags.includes(selectedTag));
  }, [projects, selectedTag]);

  const itemsPerPage = 3;
  const maxIndex = Math.max(0, filteredProjects.length - itemsPerPage);

  const getProjectTags = (project: Project) => {
    return project.tags
      .map(tagId => tags.find(t => t.id === tagId))
      .filter(Boolean)
      .slice(0, 2) as Tag[];
  };

  // Only show style tags for filtering
  const styleTags = tags.filter(t => t.category === 'style');

  return (
    <section id="realisations" className="py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm font-semibold text-[var(--accent)] uppercase tracking-wider">
            Portfolio
          </span>
          <h2 className="text-4xl font-bold mt-2 mb-4">
            Nos dernières réalisations
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Chaque site est unique, conçu spécifiquement pour le client
          </p>
        </motion.div>

        {/* Tag Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <button
            onClick={() => { setSelectedTag(null); setCurrentIndex(0); }}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all",
              !selectedTag
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            Tous
          </button>
          {styleTags.map(tag => (
            <button
              key={tag.id}
              onClick={() => { setSelectedTag(tag.id); setCurrentIndex(0); }}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                selectedTag === tag.id
                  ? "text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
              style={{
                backgroundColor: selectedTag === tag.id ? tag.color : undefined
              }}
            >
              {tag.name}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="relative">
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-6"
              animate={{ x: -currentIndex * (100 / itemsPerPage + 2) + '%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex-shrink-0 w-full md:w-[calc(33.333%-16px)]"
                  >
                    <div className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
                      {/* Preview */}
                      <div 
                        className="aspect-video flex items-center justify-center p-8"
                        style={{ 
                          background: `linear-gradient(135deg, ${project.colors[0]} 0%, ${project.colors[1] || project.colors[0]} 100%)` 
                        }}
                      >
                        <div className="text-center text-white">
                          <h4 className="text-xl font-bold">{project.name}</h4>
                          <p className="text-sm opacity-80">{project.category}</p>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-5">
                        <div className="flex flex-wrap gap-1 mb-3">
                          {getProjectTags(project).map(tag => (
                            <span
                              key={tag.id}
                              className="px-2 py-0.5 rounded-full text-xs text-white"
                              style={{ backgroundColor: tag.color }}
                            >
                              {tag.name}
                            </span>
                          ))}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {project.description}
                        </p>
                        
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>Livré en {project.delivery_time}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Navigation */}
          {filteredProjects.length > itemsPerPage && (
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0}
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center border border-gray-200 transition-all",
                  currentIndex === 0
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-900 hover:text-white hover:border-gray-900"
                )}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.ceil(filteredProjects.length / itemsPerPage) }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i * itemsPerPage)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      Math.floor(currentIndex / itemsPerPage) === i
                        ? "w-6 bg-[var(--accent)]"
                        : "bg-gray-200"
                    )}
                  />
                ))}
              </div>
              
              <button
                onClick={() => setCurrentIndex(Math.min(maxIndex, currentIndex + 1))}
                disabled={currentIndex >= maxIndex}
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center border border-gray-200 transition-all",
                  currentIndex >= maxIndex
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-900 hover:text-white hover:border-gray-900"
                )}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}



