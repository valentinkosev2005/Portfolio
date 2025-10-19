import { useState, useEffect } from 'react';
import { Award, Users, Coffee, Lightbulb, MapPin, Mail, Phone, Instagram, Zap, Heart, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';

const About = () => {
  const [activeTimeline, setActiveTimeline] = useState(0);
  const [content, setContent] = useState({
    title: 'Behind The Creative Mind',
    subtitle: 'I\'m not just a designer—I\'m a visual problem solver who believes great design can change the world, one project at a time.',
    story_title: 'From Dreamer to Creative Director',
    story_p1: 'My journey started with a simple belief: design should make people feel something. Whether it\'s excitement, trust, or pure joy—every pixel should have a purpose.',
    story_p2: 'Based in the vibrant city of Sofia, Bulgaria, I\'ve had the privilege of working with incredible clients who aren\'t afraid to think different and be bold.',
    story_p3: 'When I\'m not crafting visual stories, you\'ll find me exploring new design trends, drinking way too much energy drinks ☕, and constantly asking "What if we tried this instead?"',
    image_url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600'
  });

  const skills = [
    { name: 'Brand Identity', level: 95, icon: '🎯' },
    { name: 'Logo Design', level: 78, icon: '✨' },
    { name: 'Print Design', level: 90, icon: '📄' },
    { name: 'Digital Marketing', level: 85, icon: '📱' },
    { name: 'Web Design', level: 80, icon: '💻' },
    { name: 'Illustration', level: 88, icon: '🎨' }
  ];

  const timeline = [
    {
      year: '2019',
      title: 'The Beginning',
      description: 'Started my design journey with a passion for visual storytelling',
      icon: '🚀'
    },
    {
      year: '2021',
      title: 'First Big Break',
      description: 'Landed my first client and realized this was my calling',
      icon: '💡'
    },
    {
      year: '2024',
      title: 'Going Independent',
      description: 'Graduated and started building my creative empire',
      icon: '👑'
    },
    {
      year: '2025',
      title: 'Present Day',
      description: 'Working with amazing clients and pushing creative boundaries',
      icon: '🔥'
    }
  ];

  const achievements = [
    { icon: Award, number: '50+', label: 'Projects Completed', color: 'text-orange-400' },
    { icon: Users, number: '70+', label: 'Concepts Created', color: 'text-blue-400' },
    { icon: Coffee, number: '1000+', label: 'Energy Drinks', color: 'text-yellow-400' },
    { icon: Lightbulb, number: '5+', label: 'Years Experience', color: 'text-green-400' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTimeline((prev) => (prev + 1) % timeline.length);
    }, 3000);
    
    // Always try to load content
    loadContent();

    return () => clearInterval(interval);
  }, []);
  
  const loadContent = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('section', 'about');

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {/* Section Header */}
      <div className="text-center mb-20 scroll-reveal">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-400/10 backdrop-blur-sm rounded-full border border-orange-400/20 mb-6">
          <Heart className="w-4 h-4 text-orange-400" />
          <span className="text-sm font-mono text-orange-400">Get to know me</span>
        </div>
        
        <h2 className="text-5xl sm:text-6xl lg:text-7xl font-display text-white mb-6">
          {content.title.split(' ').slice(0, -2).join(' ')}
          <span className="block bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            {content.title.split(' ').slice(-2).join(' ')}
          </span>
        </h2>
        
        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          {content.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
        {/* Left Column - Image & Story */}
        <div className="space-y-8 scroll-reveal">
          {/* Creative Image Container */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-orange-400 to-orange-600 rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
            <div className="relative overflow-hidden rounded-2xl">
              <img 
                src={content.image_url} 
                alt="Valentin Kosev - Creative Designer"
                className="w-full h-96 object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              
              {/* Floating Elements */}
              <div className="absolute top-4 right-4 w-12 h-12 bg-orange-400/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-orange-400" />
              </div>
              <div className="absolute bottom-4 left-4 px-4 py-2 bg-black/70 backdrop-blur-sm rounded-full">
                <span className="text-white text-sm font-mono">Sofia, Bulgaria 🇧🇬</span>
              </div>
            </div>
          </div>

          {/* Personal Story */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white">
              {content.story_title.split('Creative Director')[0]}
  <span className="text-orange-400">Creative Director</span>
</h3>
            <div className="space-y-4 text-gray-400 leading-relaxed">
              <p>
                <span dangerouslySetInnerHTML={{
                  __html: content.story_p1
                    .replace(/design should make people feel something/g, '<span class="text-white font-semibold">design should make people feel something</span>')
                }} />
              </p>
              <p>
                <span dangerouslySetInnerHTML={{
                  __html: content.story_p2
                    .replace(/think different/g, '<span class="text-orange-400 font-semibold">think different</span>')
                    .replace(/be bold/g, '<span class="text-orange-400 font-semibold">be bold</span>')
                }} />
              </p>
              <p>
                {content.story_p3}
              </p>
            </div>
          </div>

          {/* Contact Info Cards */}
          <div className="grid grid-cols-2 gap-4">
            <a 
              href="mailto:vampixwork@gmail.com"
              className="interactive-card bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-xl hover:bg-white/10 transition-all duration-300 group"
            >
              <Mail className="w-6 h-6 text-orange-400 mb-2 group-hover:scale-110 transition-transform duration-300" />
              <div className="text-sm text-gray-400">Email</div>
              <div className="text-white font-medium">Let's talk</div>
            </a>
            <a 
              href="tel:+359890342280"
              className="interactive-card bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-xl hover:bg-white/10 transition-all duration-300 group"
            >
              <Phone className="w-6 h-6 text-orange-400 mb-2 group-hover:scale-110 transition-transform duration-300" />
              <div className="text-sm text-gray-400">Phone</div>
              <div className="text-white font-medium">Call me</div>
            </a>
          </div>
        </div>

        {/* Right Column - Skills & Timeline */}
        <div className="space-y-12 scroll-reveal">
          {/* Skills Section */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
              <Star className="w-6 h-6 text-orange-400" />
              What I'm Great At
            </h3>
            <div className="space-y-6">
              {skills.map((skill, index) => (
                <div 
                  key={skill.name}
                  className="group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg group-hover:scale-110 transition-transform duration-300">
                        {skill.icon}
                      </span>
                      <span className="text-white font-medium">{skill.name}</span>
                    </div>
                    <span className="text-orange-400 font-mono text-sm">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Timeline */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
              <Zap className="w-6 h-6 text-orange-400" />
              My Journey
            </h3>
            <div className="space-y-4">
              {timeline.map((item, index) => (
                <div 
                  key={index}
                  className={`interactive-card p-6 rounded-xl border transition-all duration-500 cursor-pointer ${
                    activeTimeline === index
                      ? 'bg-orange-400/10 border-orange-400/30 scale-105'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                  onClick={() => setActiveTimeline(index)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`text-2xl transition-transform duration-300 ${
                      activeTimeline === index ? 'scale-110' : ''
                    }`}>
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-orange-400 font-mono text-sm">{item.year}</span>
                        <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          activeTimeline === index ? 'bg-orange-400' : 'bg-gray-600'
                        }`} />
                      </div>
                      <h4 className="text-white font-bold mb-1">{item.title}</h4>
                      <p className="text-gray-400 text-sm">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="grid grid-cols-2 gap-4">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <div 
                  key={achievement.label}
                  className="interactive-card bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-xl text-center group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 group-hover:scale-110 transition-all duration-300 ${achievement.color} bg-current/10`}>
                    <Icon className={`w-6 h-6 ${achievement.color}`} />
                  </div>
                  <div className={`text-2xl font-bold mb-1 ${achievement.color}`}>
                    {achievement.number}
                  </div>
                  <div className="text-gray-400 text-sm font-medium">
                    {achievement.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;