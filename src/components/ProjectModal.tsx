import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

interface ProjectImage {
  url: string;
  caption?: string;
}

interface Project {
  id: string | number;
  title: string;
  category: string;
  description: string;
  images: ProjectImage[];
  client?: string;
  year?: string;
  services?: string[];
}

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectModal = ({ project, isOpen, onClose }: ProjectModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen || !project) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === project.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? project.images.length - 1 : prev - 1
    );
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in-up"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-6xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300 hover:scale-110 shadow-lg"
        >
          <X className="w-6 h-6 text-slate-700" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          {/* Image Section */}
          <div className="relative bg-slate-100 flex items-center justify-center min-h-[400px] lg:min-h-[600px]">
            {project.images.length > 0 && (
              <>
                <img
                  src={project.images[currentImageIndex]?.url}
                  alt={project.images[currentImageIndex]?.caption || project.title}
                  className="w-full h-full object-contain transition-all duration-500"
                />
                
                {/* Image Navigation */}
                {project.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300 hover:scale-110 shadow-lg"
                    >
                      <ChevronLeft className="w-6 h-6 text-slate-700" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300 hover:scale-110 shadow-lg"
                    >
                      <ChevronRight className="w-6 h-6 text-slate-700" />
                    </button>
                    
                    {/* Image Indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {project.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === currentImageIndex 
                              ? 'bg-amber-500 w-6' 
                              : 'bg-white/60 hover:bg-white/80'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          {/* Content Section */}
          <div className="p-8 overflow-y-auto">
            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 text-sm font-medium rounded-full">
                    {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
                  </span>
                  {project.year && (
                    <span className="text-slate-500 text-sm">{project.year}</span>
                  )}
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-4">
                  {project.title}
                </h2>
                {project.client && (
                  <p className="text-slate-600 mb-4">
                    <strong>Client:</strong> {project.client}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Project Overview</h3>
                <p className="text-slate-600 leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Services */}
              {project.services && project.services.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">Services Provided</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.services.map((service, index) => (
                      <span
                        key={service}
                        className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full hover:bg-slate-200 transition-colors duration-300 animate-fade-in-up opacity-0"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Image Caption */}
              {project.images[currentImageIndex]?.caption && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">Current Image</h3>
                  <p className="text-slate-600">
                    {project.images[currentImageIndex].caption}
                  </p>
                </div>
              )}

              {/* CTA */}
              <div className="pt-6 border-t border-slate-200">
                <p className="text-slate-600 mb-4">
                  Interested in a similar project? Let's discuss your vision.
                </p>
                <a
                  href="#contact"
                  onClick={onClose}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 font-medium shadow-lg hover:shadow-xl"
                >
                  <ExternalLink className="w-4 h-4" />
                  Start Your Project
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;