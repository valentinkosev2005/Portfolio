import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Instagram, MessageCircle, Zap, Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Contact = () => {
  const [content, setContent] = useState({
    title: 'Ready To Create Something Amazing?',
    subtitle: 'I\'m always excited to work on new projects and collaborate with creative minds. Let\'s turn your vision into reality.',
    email: 'vampixwork@gmail.com',
    phone: '+359 89 034 2280',
    location: 'Sofia, Bulgaria',
    instagram: '@vk_creative.designs',
    instagram_url: 'https://www.instagram.com/vk_creative.designs?igsh=MWkzeXc1NHprZHFodQ=='
  });

  useEffect(() => {
    // Always try to load content
    loadContent();
  }, []);
  
  const loadContent = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('section', 'contact');

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


  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: content.email,
      href: `mailto:${content.email}`,
      color: 'text-blue-400',
      description: 'Drop me a line'
    },
    {
      icon: Phone,
      label: 'Phone',
      value: content.phone,
      href: `tel:${content.phone.replace(/\s/g, '')}`,
      color: 'text-green-400',
      description: 'Let\'s talk'
    },
    {
      icon: MapPin,
      label: 'Location',
      value: content.location,
      href: '#',
      color: 'text-orange-400',
      description: 'Where the magic happens'
    },
    {
      icon: Instagram,
      label: 'Instagram',
      value: content.instagram,
      href: content.instagram_url,
      color: 'text-pink-400',
      description: 'Follow my journey'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {/* Section Header */}
      <div className="text-center mb-20 scroll-reveal">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-400/10 backdrop-blur-sm rounded-full border border-orange-400/20 mb-6">
          <MessageCircle className="w-4 h-4 text-orange-400" />
          <span className="text-sm font-mono text-orange-400">Let's collaborate</span>
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

      <div className="max-w-2xl mx-auto scroll-reveal">
        <div className="space-y-8">
          <div>
            <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
              <Zap className="w-8 h-8 text-orange-400" />
              Get In Touch
            </h3>
            <p className="text-gray-400 mb-8 leading-relaxed text-lg">
              Have a project in mind? Want to collaborate? Or just want to say hi?
              I'd love to hear from you. Choose your preferred way to connect:
            </p>
          </div>

          <div className="space-y-6">
            {contactInfo.map((item, index) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="interactive-card bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-all duration-300 group block"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 ${item.color} bg-current/10`}>
                      <Icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white group-hover:text-orange-400 transition-colors duration-300">
                          {item.label}
                        </span>
                      </div>
                      <div className="text-gray-300 mb-1">
                        {item.value}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.description}
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Fun Fact */}
          <div className="interactive-card bg-gradient-to-r from-orange-400/10 to-orange-600/10 border border-orange-400/20 p-6 rounded-xl">
            <div className="flex items-start gap-3">
              <Heart className="w-6 h-6 text-orange-400 mt-1" />
              <div>
                <h4 className="text-white font-bold mb-2">Fun Fact</h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  I respond to all messages within 24 hours (usually much faster).
                  I believe great communication is the foundation of great design.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;