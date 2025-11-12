import { useState } from 'react';
import { ChevronUp, Home, FileText, Mail, Instagram } from 'lucide-react';

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  const menuItems = [
    { icon: Home, label: 'Home', action: () => scrollToSection('home'), delay: '0s' },
    { icon: FileText, label: 'Work', action: () => scrollToSection('portfolio'), delay: '0.05s' },
    { icon: Mail, label: 'Contact', action: () => scrollToSection('contact'), delay: '0.1s' },
  ];

  const externalItems = [
    {
      icon: Instagram,
      label: 'Instagram',
      href: 'https://www.instagram.com/vk_creative.designs?igsh=MWkzeXc1NHprZHFodQ==',
      delay: '0.15s'
    },
  ];

  return (
    <div className="fab-container">
      <div
        className="fab-main group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <ChevronUp className="w-6 h-6 text-white transition-transform duration-300 group-hover:rotate-180" />
      </div>

      <div className={`fab-menu ${isOpen ? 'open' : ''}`}>
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="fab-item group"
              style={{
                bottom: `${80 + index * 70}px`,
                right: '0px',
                transitionDelay: item.delay,
              }}
              onClick={item.action}
              title={item.label}
            >
              <Icon className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
            </div>
          );
        })}

        {externalItems.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="fab-item group"
              style={{
                bottom: `${80 + menuItems.length * 70}px`,
                right: '0px',
                transitionDelay: item.delay,
              }}
              title={item.label}
            >
              <Icon className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
            </a>
          );
        })}
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default FloatingActionButton;
