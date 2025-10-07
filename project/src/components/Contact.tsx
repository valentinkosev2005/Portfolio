import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Instagram, Send, CheckCircle, AlertCircle, MessageCircle, Zap, Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      let response;
      let result;
      
      try {
        response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contact-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify(formData)
        });

        result = await response.json();

        if (response.ok) {
          setSubmitStatus('success');
          setStatusMessage(result.message || 'Message sent successfully! I\'ll get back to you soon.');
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            subject: '',
            message: ''
          });
          return;
        } else {
          throw new Error(result.error || 'Edge function failed');
        }
      } catch (edgeFunctionError) {
        console.log('Edge function failed, trying fallback method:', edgeFunctionError);
        
        const emailBody = `Name: ${formData.firstName} ${formData.lastName}%0D%0AEmail: ${formData.email}%0D%0A%0D%0AMessage:%0D%0A${encodeURIComponent(formData.message)}`;
        const mailtoLink = `mailto:${content.email}?subject=${encodeURIComponent(formData.subject)}&body=${emailBody}`;
        
        window.open(mailtoLink, '_blank');
        
        setSubmitStatus('success');
        setStatusMessage('Your email client has been opened with the message. Please send the email from there.');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          subject: '',
          message: ''
        });
      }
    } catch (error: any) {
      console.error('Contact form error:', error);
      setSubmitStatus('error');
      setStatusMessage(`Unable to send email automatically. Please contact me directly at ${content.email} or call ${content.phone}.`);
    } finally {
      setIsSubmitting(false);
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Contact Information */}
        <div className="space-y-8 scroll-reveal">
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

        {/* Contact Form */}
        <div className="scroll-reveal">
          <div className="interactive-card bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-white mb-6">Send Me a Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-300 text-white placeholder-gray-500"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-300 text-white placeholder-gray-500"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-300 text-white placeholder-gray-500"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-300 text-white placeholder-gray-500"
                  placeholder="Let's work together!"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-300 resize-none text-white placeholder-gray-500"
                  placeholder="Tell me about your project, your vision, and how we can create something amazing together..."
                />
              </div>

              {/* Status Message */}
              {submitStatus !== 'idle' && (
                <div className={`flex items-center gap-2 p-4 rounded-lg animate-slide-up ${
                  submitStatus === 'success' 
                    ? 'bg-green-400/10 text-green-400 border border-green-400/20' 
                    : 'bg-red-400/10 text-red-400 border border-red-400/20'
                }`}>
                  {submitStatus === 'success' ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <AlertCircle className="w-5 h-5" />
                  )}
                  <span>{statusMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <>
                    <div className="loading-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;