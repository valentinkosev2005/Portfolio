import { useState, useEffect } from 'react';
import { ArrowDown, Sparkles, Zap, Palette } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [content, setContent] = useState({
    greeting: 'Available for new projects',
    name: 'Valentin Kosev',
    tagline: 'I turn wild ideas into visual stories that make people stop scrolling',
    description: 'Creative director & graphic designer in Sofia, Bulgaria. Specializing in brands that dare to be different.',
    cta_primary: 'See My Work',
    cta_secondary: 'Let\'s Create Magic',
    stats_projects: '50+',
    stats_years: '5+',
    stats_clients: '3000',
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    // Trigger animations after component mounts
    setTimeout(() => setIsLoaded(true), 100);
    
    // Always try to load content
    loadContent();

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  const loadContent = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('section', 'hero');

      if (error) {
        return; // Use default content if table doesn't exist
      }
      
      const contentMap: any = {};
      data?.forEach((item: any) => {
        contentMap[item.key] = item.value;
      });
      
      setContent(prev => ({ ...prev, ...contentMap }));
    } catch (error) {
      // Continue with default content
    }
  };

  return (
    <>
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="bg-orb"></div>
        <div className="bg-orb"></div>
        <div className="bg-orb"></div>
      </div>

      {/* Cursor Trail */}
      <div 
        className="cursor-trail"
        style={{
          left: mousePosition.x - 10,
          top: mousePosition.y - 10,
          opacity: mousePosition.x > 0 ? 0.6 : 0
        }}
      />

      <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Floating Shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 shape-blob" style={{ animationDelay: '0s' }} />
        <div className="absolute bottom-20 right-20 w-24 h-24 shape-blob" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-10 w-16 h-16 shape-blob" style={{ animationDelay: '4s' }} />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          {/* Main Content */}
          <div className="space-y-8">
            {/* Greeting */}
            <div className={`opacity-0 ${isLoaded ? 'animate-text-reveal delay-100' : ''}`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 mb-6">
                <Sparkles className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-mono text-gray-300">{content.greeting}</span>
              </div>
            </div>

            {/* Name with Gradient */}
            <div className={`opacity-0 ${isLoaded ? 'animate-text-reveal delay-200' : ''}`}>
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-display mb-4">
                <span className="bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent animate-gradient">
                  {content.name.split(' ')[0]}
                </span>
                <br />
                <span className="text-white">{content.name.split(' ')[1]}</span>
              </h1>
            </div>

            {/* Creative Tagline */}
            <div className={`opacity-0 ${isLoaded ? 'animate-text-reveal delay-300' : ''}`}>
              <h2 
                className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-300 mb-8 max-w-4xl mx-auto leading-tight"
                dangerouslySetInnerHTML={{
                  __html: content.tagline
                    .replace(/wild ideas/g, '<span class="text-orange-400 font-semibold">wild ideas</span>')
                    .replace(/visual stories/g, '<span class="text-orange-400 font-semibold">visual stories</span>')
                }}
              />
            </div>

            {/* Description */}
            <div className={`opacity-0 ${isLoaded ? 'animate-text-reveal delay-400' : ''}`}>
              <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-12">
                {content.description}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className={`opacity-0 ${isLoaded ? 'animate-slide-up delay-500' : ''}`}>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <a
                  href="#portfolio"
                  className="btn-primary group"
                >
                  <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  {content.cta_primary}
                </a>
                
                <a
                  href="#contact"
                  className="btn-secondary group"
                >
                  <Palette className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  {content.cta_secondary}
                </a>
              </div>
            </div>

            {/* Stats */}
            <div className={`opacity-0 ${isLoaded ? 'animate-slide-up delay-600' : ''}`}>
              <div className="flex flex-wrap justify-center gap-8 mt-16 text-center">
                <div className="group">
                  <div className="text-3xl font-bold text-orange-400 group-hover:scale-110 transition-transform duration-300">{content.stats_projects}</div>
                  <div className="text-sm text-gray-400 font-mono">Projects</div>
                </div>
                <div className="group">
                  <div className="text-3xl font-bold text-orange-400 group-hover:scale-110 transition-transform duration-300">{content.stats_years}</div>
                  <div className="text-sm text-gray-400 font-mono">Years</div>
                </div>
                <div className="group">
                  <div className="text-3xl font-bold text-orange-400 group-hover:scale-110 transition-transform duration-300">{content.stats_clients}</div>
                  <div className="text-sm text-gray-400 font-mono">Pixels That Pop</div>
                </div>
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className={`opacity-0 ${isLoaded ? 'animate-slide-up delay-700' : ''}`}>
              <div className="flex flex-col items-center mt-20">
                <p className="text-sm text-gray-500 mb-4 font-mono">Scroll to explore</p>
                <div className="animate-bounce">
                  <ArrowDown className="w-6 h-6 text-orange-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Elements */}
        <div 
          className="absolute w-4 h-4 bg-orange-400 rounded-full opacity-20 pointer-events-none transition-all duration-300"
          style={{
            left: mousePosition.x * 0.1,
            top: mousePosition.y * 0.1,
          }}
        />
        <div 
          className="absolute w-2 h-2 bg-orange-300 rounded-full opacity-30 pointer-events-none transition-all duration-500"
          style={{
            left: mousePosition.x * 0.05,
            top: mousePosition.y * 0.05,
          }}
        />
      </div>
    </>
  );
};

export default Hero;