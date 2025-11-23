import { useState, useEffect, useRef } from 'react';
import { ExternalLink, Filter, Eye, Calendar, User, Sparkles } from 'lucide-react';
import ProjectModal from './ProjectModal';

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
  is_featured?: boolean;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleProjects, setVisibleProjects] = useState<Project[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const filters = [
    { id: 'all', label: 'All Work', icon: '🎨' },
    { id: 'branding', label: 'Branding', icon: '🔥' },
    { id: 'web', label: 'Digital', icon: '💻' },
    { id: 'print', label: 'Print', icon: '📄' },
    { id: 'illustration', label: 'Art', icon: '✨' }
  ];

  const projects: Project[] = [
  {
    id: '1',
    title: 'Gn. Pechen - Brand Revolution',
    category: 'branding',
    description: 'Complete brand transformation for a local kiosk business. From forgotten corner shop to neighborhood icon.',
    client: 'Gn. Pechen',
    year: '2025',
    services: ['Brand Strategy', 'Logo Design', 'Packaging', 'Marketing Materials'],
    is_featured: true,
    images: [
      { url: 'https://images.pexels.com/photos/3568518/pexels-photo-3568518.jpeg?auto=compress&cs=tinysrgb&w=600', caption: 'Logo Design' },
      { url: 'https://images.pexels.com/photos/3962286/pexels-photo-3962286.jpeg?auto=compress&cs=tinysrgb&w=600', caption: 'Social Media Post' },
      { url: 'https://images.pexels.com/photos/3944441/pexels-photo-3944441.jpeg?auto=compress&cs=tinysrgb&w=600', caption: 'Flyer Design' },
      { url: 'https://images.pexels.com/photos/3962570/pexels-photo-3962570.jpeg?auto=compress&cs=tinysrgb&w=600', caption: 'Menu Design' }
    ]
  },
  {
    id: '2',
    title: 'VK Business Card',
    category: 'print',
    description: 'Not your average business card. These babies make people remember you.',
    client: 'Various Clients',
    year: '2024',
    services: ['Print Design', 'Typography', 'Brand Application'],
    images: [
      { url: 'https://images.pexels.com/photos/3721035/pexels-photo-3721035.jpeg?auto=compress&cs=tinysrgb&w=600', caption: 'Logo' },
      { url: 'https://images.pexels.com/photos/3962570/pexels-photo-3962570.jpeg?auto=compress&cs=tinysrgb&w=600', caption: 'Mockup' },
      { url: 'https://images.pexels.com/photos/3944441/pexels-photo-3944441.jpeg?auto=compress&cs=tinysrgb&w=600', caption: 'Front Design' },
      { url: 'https://images.pexels.com/photos/3568518/pexels-photo-3568518.jpeg?auto=compress&cs=tinysrgb&w=600', caption: 'Back Design' }
      ]
    },
    {
      id: '3',
      title: "Valentine's Party - School Event",
      category: 'illustration',
      description: 'Making school events unforgettable with custom illustrations and vibrant design.',
      client: 'Trevnenska Shkola',
      year: '2024',
      services: ['Illustration', 'Event Design', 'Social Media Graphics'],
      images: [
        { url: 'https://images.pexels.com/photos/3962286/pexels-photo-3962286.jpeg?auto=compress&cs=tinysrgb&w=600', caption: 'Mockup'},
        { url: 'https://images.pexels.com/photos/3721035/pexels-photo-3721035.jpeg?auto=compress&cs=tinysrgb&w=600', caption: 'Design' }
      ]
    },
    {
      id: '4',
      title: 'Volleyball Tournament - Sports Energy',
      category: 'print',
      description: 'Capturing the energy and excitement of competitive sports through bold design.',
      client: 'Sports Club',
      year: '2023',
      services: ['Sports Graphics', 'Typography', 'Print Design'],
      images: [
        { url: 'https://imgur.com/q02oxQv.jpeg', caption: 'Tournament Poster' },
        { url: 'https://imgur.com/ZJD6bJ1.jpeg', caption: 'Design'}
      ]
    },
    {
      id: '5',
      title: 'Carnival of Gabrovo - Cultural Heritage',
      category: 'illustration',
      description: 'Celebrating Bulgarian culture with vibrant illustrations and traditional elements.',
      client: 'City of Gabrovo',
      year: '2023',
      services: ['Cultural Design', 'Illustration', 'Event Branding'],
      images: [
        { url: 'https://imgur.com/DCcDGXi.jpeg', caption: 'Mockup' },
        { url: 'https://imgur.com/LCnt9Zf.jpeg', caption: 'Design'}
      ]
    },
    {
      id: '6',
      title: 'XFUEL Designs',
      category: 'web',
      description: 'Digital marketing materials that convert browsers into buyers.',
      client: 'XFUEL',
      year: '2025',
      services: ['Digital Marketing', 'Social Media', 'Bilboard Design'],
      images: [
        { url: 'https://imgur.com/j3BgtRf.jpeg', caption: 'Mockup' },
        { url: 'https://imgur.com/nO7aPsc.jpeg', caption: 'Bilboard' },
        { url: 'https://imgur.com/wTdGiYZ.jpeg', caption: 'Mockup' },
        { url: 'https://imgur.com/JWSl0yV.jpeg', caption: 'Mockup'},
      ]
    }
  ];

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  useEffect(() => {
    // Animate projects in with stagger
    setVisibleProjects([]);
    filteredProjects.forEach((project, index) => {
      setTimeout(() => {
        setVisibleProjects(prev => [...prev, project]);
      }, index * 100);
    });
  }, [activeFilter]);

  const openProjectModal = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeProjectModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Section Header */}
        <div className="text-center mb-20 scroll-reveal">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-400/10 backdrop-blur-sm rounded-full border border-orange-400/20 mb-6">
            <Eye className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-mono text-orange-400">Selected Work</span>
          </div>
          
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-display text-white mb-6">
            Projects That
            <span className="block bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              Make Impact
            </span>
          </h2>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Each project tells a story. Here are some of my favorites that pushed boundaries and delivered results.
          </p>
        </div>

        {/* Creative Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-16 scroll-reveal">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`group px-6 py-3 rounded-full font-medium transition-all duration-500 transform hover:scale-105 ${
                activeFilter === filter.id
                  ? 'bg-gradient-to-r from-orange-400 to-orange-600 text-white shadow-lg shadow-orange-400/30'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-lg group-hover:scale-110 transition-transform duration-300">
                  {filter.icon}
                </span>
                {filter.label}
              </span>
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" ref={containerRef}>
          {visibleProjects.map((project, index) => (
            <div
              key={project.id}
              className="portfolio-item interactive-card tilt-card bg-white/5 backdrop-blur-sm border border-white/10 cursor-pointer group glow-effect"
              onClick={() => openProjectModal(project)}
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div className="image-container relative overflow-hidden flex items-center justify-center bg-black/10">

                <img 
                  src={project.images[0]?.url} 
                  alt={project.title}
                   className="w-full h-auto max-w-full max-h-[500px] object-contain rounded-lg transition-transform duration-500 group-hover:scale-105"
  onLoad={(e) => {
    const img = e.currentTarget;
    if (img.naturalHeight > img.naturalWidth) {
      img.classList.add('portrait');
    } else {
      img.classList.add('landscape');
    }
  }}
                />
                
                {/* Hover Overlay */}
                <div className="portfolio-overlay">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-orange-400" />
                    <span className="text-sm font-mono text-orange-400">{project.year}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-400">{project.client}</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-orange-400 group-hover:rotate-45 transition-transform duration-300" />
                  </div>
                </div>

                {/* Image Count Badge */}
                {project.images.length > 1 && (
                  <div className="absolute top-4 right-4 px-2 py-1 bg-black/70 text-white text-xs rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                    +{project.images.length - 1} more
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-orange-400/20 text-orange-400 text-xs font-medium rounded-full">
                    {filters.find(f => f.id === project.category)?.label}
                  </span>
                  {project.is_featured && (
                    <span className="px-3 py-1 bg-gradient-to-r from-orange-400 to-orange-600 text-white text-xs font-medium rounded-full">
                      Featured
                    </span>
                  )}
                </div>
                
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-gray-400 text-sm leading-relaxed">
                  {project.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-16 scroll-reveal">
          <button className="btn-primary group">
            <Sparkles className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            View All Projects
          </button>
        </div>
      </div>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={closeProjectModal}
      />
    </>
  );
};

export default Portfolio;