import { Heart, Instagram, Mail, Phone, Zap, ArrowUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useState, useEffect } from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [content, setContent] = useState({
    description: 'Creating meaningful visual experiences that connect brands with their audiences. Based in Sofia, Bulgaria, working with clients worldwide.',
    copyright: 'VK Designs. All rights reserved.',
    email: 'vampixwork@gmail.com',
    phone: '+359 89 034 2280',
    instagram_url: 'https://www.instagram.com/vk_creative.designs?igsh=MWkzeXc1NHprZHFodQ=='
  });

  useEffect(() => {
    // Always try to load content
    loadContent();
  }, []);
  
  const loadContent = async () => {
    try {
      const { data: footerData, error: footerError } = await supabase
        .from('site_content')
        .select('*')
        .eq('section', 'footer');
        
      const { data: contactData, error: contactError } = await supabase
        .from('site_content')
        .select('*')
        .eq('section', 'contact');

      if (footerError) {
      }
      if (contactError) {
      }
      
      // Only process data if no errors
      if (!footerError && !contactError) {
        const contentMap: any = {};
        [...(footerData || []), ...(contactData || [])].forEach((item: any) => {
          contentMap[item.key] = item.value;
        });
        
        setContent(prev => ({ ...prev, ...contentMap }));
      }
    } catch (error) {
    }
  };
      
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black/50 backdrop-blur-sm border-t border-white/10 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand Section */}
          <div className="space-y-6 scroll-reveal">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-600 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-xl blur-lg opacity-30" />
              </div>
              <div>
                <span className="text-2xl font-display font-bold text-white">VK Designs</span>
                <div className="text-sm font-mono text-gray-400 -mt-1">Creative Studio</div>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed">
              {content.description}
            </p>
            <div className="flex items-center gap-2 text-orange-400">
              <Heart className="w-4 h-4 animate-pulse" />
              <span className="text-sm font-mono">Made with passion</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6 scroll-reveal">
            <h4 className="text-lg font-bold text-white">Quick Links</h4>
            <div className="space-y-3">
              {[
                { name: 'Home', href: '#home' },
                { name: 'Work', href: '#portfolio' },
                { name: 'About', href: '#about' },
                { name: 'Contact', href: '#contact' }
              ].map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block text-gray-400 hover:text-orange-400 transition-all duration-300 hover:translate-x-2 transform group"
                >
                  <span className="flex items-center gap-2">
                    {link.name}
                    <ArrowUp className="w-3 h-3 rotate-45 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6 scroll-reveal">
            <h4 className="text-lg font-bold text-white">Let's Connect</h4>
            <div className="space-y-4">
              <a
                href={`mailto:${content.email}`}
                className="flex items-center gap-3 text-gray-400 hover:text-orange-400 transition-all duration-300 group"
              >
                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-orange-400/10 transition-colors duration-300">
                  <Mail className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span className="text-sm">{content.email}</span>
              </a>
              <a
                href={`tel:${content.phone.replace(/\s/g, '')}`}
                className="flex items-center gap-3 text-gray-400 hover:text-orange-400 transition-all duration-300 group"
              >
                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-orange-400/10 transition-colors duration-300">
                  <Phone className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span className="text-sm">{content.phone}</span>
              </a>
              <a
                href={content.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-400 hover:text-orange-400 transition-all duration-300 group"
              >
                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-orange-400/10 transition-colors duration-300">
                  <Instagram className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span className="text-sm">@vk_creative.designs</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center scroll-reveal">
          <p className="text-gray-500 text-sm">
            © {currentYear} {content.copyright}
          </p>
          
          <button
            onClick={scrollToTop}
            className="mt-4 md:mt-0 interactive-card bg-white/5 hover:bg-orange-400/10 border border-white/10 hover:border-orange-400/30 p-3 rounded-full transition-all duration-300 group"
          >
            <ArrowUp className="w-4 h-4 text-gray-400 group-hover:text-orange-400 transition-colors duration-300" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;