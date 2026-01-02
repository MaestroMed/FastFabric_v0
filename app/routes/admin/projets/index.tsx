import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import type { Route } from "./+types/index";
import { Card } from '~/components/ui/Card';
import { Badge } from '~/components/ui/Badge';
import { Button } from '~/components/ui/Button';
import { localStore } from '~/lib/store';
import { Plus, Edit, Trash2, Star, Clock, ExternalLink } from 'lucide-react';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Projets — Admin — FastFabric" },
  ];
}

export default function AdminProjets() {
  const [projects, setProjects] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);

  useEffect(() => {
    setProjects(localStore.getProjects());
    setTags(localStore.getTags());
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Supprimer ce projet ?')) {
      localStore.deleteProject(id);
      setProjects(localStore.getProjects());
    }
  };

  const toggleFeatured = (project: any) => {
    localStore.saveProject({ ...project, is_featured: !project.is_featured });
    setProjects(localStore.getProjects());
  };

  const getProjectTags = (project: any) => {
    return project.tags
      ?.map((id: string) => tags.find((t: any) => t.id === id))
      .filter(Boolean) || [];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projets</h1>
          <p className="text-gray-600">Gérez votre portfolio de réalisations</p>
        </div>
        <Link to="/admin/projets/new">
          <Button>
            <Plus className="w-4 h-4" />
            Nouveau projet
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} padding="none" className="overflow-hidden">
            {/* Preview */}
            <div 
              className="aspect-video flex items-center justify-center p-6 relative"
              style={{ 
                background: `linear-gradient(135deg, ${project.colors[0]} 0%, ${project.colors[1] || project.colors[0]} 100%)` 
              }}
            >
              {project.is_featured && (
                <div className="absolute top-2 right-2">
                  <Badge variant="warning" className="bg-yellow-400 text-yellow-900">
                    <Star className="w-3 h-3 mr-1" />
                    Vedette
                  </Badge>
                </div>
              )}
              <div className="text-center text-white">
                <h3 className="font-bold text-lg">{project.name}</h3>
                <p className="text-sm opacity-80">{project.category}</p>
              </div>
            </div>

            {/* Info */}
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {getProjectTags(project).slice(0, 3).map((tag: any) => (
                  <span
                    key={tag.id}
                    className="px-2 py-0.5 rounded-full text-xs text-white"
                    style={{ backgroundColor: tag.color }}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{project.delivery_time}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleFeatured(project)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      project.is_featured ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
                    }`}
                  >
                    <Star className="w-4 h-4" fill={project.is_featured ? 'currentColor' : 'none'} />
                  </button>
                  <Link to={`/admin/projets/${project.id}`}>
                    <button className="p-1.5 rounded-lg text-gray-400 hover:text-[var(--accent)]">
                      <Edit className="w-4 h-4" />
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}



