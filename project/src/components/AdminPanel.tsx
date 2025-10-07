import { useState, useEffect } from 'react';
import { supabase, Project, ProjectImage, SiteContent } from '../lib/supabase';
import { Upload, Plus, CreditCard as Edit, Trash2, Save, X, Image as ImageIcon, Eye, EyeOff, Settings, FileText, User, Mail, Home, Star, MessageCircle, Heart, ExternalLink, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [activeTab, setActiveTab] = useState<'projects' | 'content'>('projects');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);

  // Form state for project editing
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    client: '',
    year: '',
    services: '',
    is_featured: false,
    display_order: 0
  });

  // Site content editing state
  const [editingContent, setEditingContent] = useState<{[key: string]: string}>({});

  useEffect(() => {
    checkAuth();
    if (isAuthenticated) {
      loadProjects();
      loadSiteContent();
    }
  }, [isAuthenticated]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user?.email === 'vampixwork@gmail.com') {
      setIsAuthenticated(true);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (email === 'vampixwork@gmail.com' && password === '260524bg') {
        setIsAuthenticated(true);
        setShowPanel(true);
      } else {
        alert('Invalid credentials. Access denied.');
      }
    } catch (error: any) {
      alert('Login failed. Please check your credentials.');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setShowPanel(false);
  };

  const loadProjects = async () => {
    try {
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true });

      if (projectsError) throw projectsError;

      const { data: imagesData, error: imagesError } = await supabase
        .from('project_images')
        .select('*')
        .order('display_order', { ascending: true });

      if (imagesError) throw imagesError;

      const projectsWithImages = projectsData.map(project => ({
        ...project,
        images: imagesData.filter(img => img.project_id === project.id)
      }));

      setProjects(projectsWithImages);
    } catch (error: any) {
      console.error('Error loading projects:', error);
    }
  };

  const loadSiteContent = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .order('section', { ascending: true });

      if (error) {
        console.error('Error loading site content:', error);
        setSiteContent([]);
        return;
      }
      
      setSiteContent(data || []);
      
      if (data) {
        // Initialize editing state
        const contentMap: {[key: string]: string} = {};
        data.forEach((item: any) => {
          contentMap[`${item.section}.${item.key}`] = item.value;
        });
        setEditingContent(contentMap);
      }
    } catch (error: any) {
      console.error('Error loading site content:', error);
      setSiteContent([]);
    }
  };

  const updateSiteContent = async (section: string, key: string, value: string) => {
    try {
      const { error } = await supabase
        .from('site_content')
        .upsert({
          section,
          key,
          value,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'section,key'
        });

      if (error) throw error;
      
      // Update local state
      setEditingContent(prev => ({
        ...prev,
        [`${section}.${key}`]: value
      }));
      
      // Reload content to sync
      await loadSiteContent();
    } catch (error: any) {
      console.error('Error updating site content:', error);
      alert('Failed to update content: ' + error.message);
    }
  };

  const handleImageUpload = async (files: FileList, projectId: string) => {
    setIsUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file, index) => {
        // Create a simple URL for the image (in a real app, you'd upload to storage)
        const imageUrl = URL.createObjectURL(file);
        
        // For demo purposes, we'll use placeholder URLs
        const placeholderUrls = [
          'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600',
          'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=600',
          'https://images.pexels.com/photos/3184293/pexels-photo-3184293.jpeg?auto=compress&cs=tinysrgb&w=600'
        ];
        
        const { error: dbError } = await supabase
          .from('project_images')
          .insert({
            project_id: projectId,
            image_url: placeholderUrls[index % placeholderUrls.length],
            caption: `New image ${index + 1}`,
            display_order: index
          });

        if (dbError) throw dbError;
      });

      await Promise.all(uploadPromises);
      await loadProjects();
      alert('Images uploaded successfully!');
    } catch (error: any) {
      alert('Upload failed: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const saveProject = async () => {
    try {
      const projectData = {
        ...formData,
        services: formData.services ? formData.services.split(',').map(s => s.trim()) : []
      };

      if (selectedProject) {
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', selectedProject.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('projects')
          .insert(projectData);
        
        if (error) throw error;
      }

      await loadProjects();
      setIsEditing(false);
      setSelectedProject(null);
      resetForm();
      alert('Project saved successfully!');
    } catch (error: any) {
      alert('Save failed: ' + error.message);
    }
  };

  const deleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      await loadProjects();
      alert('Project deleted successfully!');
    } catch (error: any) {
      alert('Delete failed: ' + error.message);
    }
  };

  const deleteImage = async (imageId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const { error } = await supabase
        .from('project_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;

      await loadProjects();
      alert('Image deleted successfully!');
    } catch (error: any) {
      alert('Delete failed: ' + error.message);
    }
  };

  const updateImageCaption = async (imageId: string, caption: string) => {
    try {
      const { error } = await supabase
        .from('project_images')
        .update({ caption })
        .eq('id', imageId);

      if (error) throw error;

      await loadProjects();
    } catch (error: any) {
      alert('Failed to update caption: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      description: '',
      client: '',
      year: '',
      services: '',
      is_featured: false,
      display_order: 0
    });
  };

  const startEdit = (project: Project) => {
    setSelectedProject(project);
    setFormData({
      title: project.title,
      category: project.category,
      description: project.description,
      client: project.client || '',
      year: project.year || '',
      services: project.services?.join(', ') || '',
      is_featured: project.is_featured,
      display_order: project.display_order || 0
    });
    setIsEditing(true);
  };

  const groupedContent = siteContent.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {} as {[key: string]: SiteContent[]});

  const renderContentEditor = (item: SiteContent) => {
    const contentKey = `${item.section}.${item.key}`;
    const value = editingContent[contentKey] || item.value;

    if (item.type === 'textarea') {
      return (
        <textarea
          value={value}
          onChange={(e) => setEditingContent(prev => ({
            ...prev,
            [contentKey]: e.target.value
          }))}
          onBlur={() => updateSiteContent(item.section, item.key, value)}
          className="w-full px-3 py-2 border rounded-lg text-sm h-20 resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder={item.key}
        />
      );
    }

    return (
      <input
        type={item.type === 'url' ? 'url' : 'text'}
        value={value}
        onChange={(e) => setEditingContent(prev => ({
          ...prev,
          [contentKey]: e.target.value
        }))}
        onBlur={() => updateSiteContent(item.section, item.key, value)}
        className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        placeholder={item.key}
      />
    );
  };

  const openImageModal = (project: Project, imageIndex: number) => {
    setSelectedProject(project);
    setSelectedImageIndex(imageIndex);
    setShowImageModal(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed bottom-8 right-6 z-[9999]">
        <button
          onClick={() => setShowPanel(!showPanel)}
          className="p-4 bg-slate-800 text-white rounded-full shadow-xl hover:bg-slate-700 transition-all duration-300 hover:scale-110 active:scale-95 touch-manipulation"
        >
          <Settings className="w-5 h-5" />
        </button>

        {showPanel && (
          <div className="absolute bottom-20 right-0 w-80 sm:w-96 bg-white rounded-lg shadow-xl p-6 border max-w-[calc(100vw-2rem)] mr-2 sm:mr-0">
            <h3 className="text-lg font-bold mb-4">Admin Login</h3>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Login
              </button>
            </form>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="fixed bottom-8 right-6 z-[9999]">
        <button
          onClick={() => setShowPanel(!showPanel)}
          className="p-4 bg-slate-800 text-white rounded-full shadow-xl hover:bg-slate-700 transition-all duration-300 hover:scale-110 active:scale-95 touch-manipulation"
        >
          {showPanel ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>

        {showPanel && (
          <div className="absolute bottom-20 right-0 w-80 sm:w-96 max-h-[80vh] bg-white rounded-lg shadow-xl border overflow-hidden max-w-[calc(100vw-2rem)] mr-2 sm:mr-0">
            <div className="p-4 bg-slate-800 text-white flex justify-between items-center">
              <h3 className="font-bold">Admin Panel</h3>
              <button
                onClick={handleLogout}
                className="text-sm hover:text-orange-300 transition-colors"
              >
                Logout
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab('projects')}
                className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'projects'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FileText className="w-4 h-4 inline mr-2" />
                Projects
              </button>
              <button
                onClick={() => setActiveTab('content')}
                className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'content'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Settings className="w-4 h-4 inline mr-2" />
                Site Content
              </button>
            </div>

            <div className="p-4 max-h-96 overflow-y-auto">
              {activeTab === 'projects' ? (
                // Projects Tab Content
                <>
                  {isEditing ? (
                    <div className="space-y-4">
                      <h4 className="font-bold">{selectedProject ? 'Edit Project' : 'New Project'}</h4>
                      
                      <input
                        type="text"
                        placeholder="Title"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
                      />
                      
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">Select Category</option>
                        <option value="branding">Branding</option>
                        <option value="web">Web Design</option>
                        <option value="print">Print Design</option>
                        <option value="illustration">Illustration</option>
                      </select>
                      
                      <textarea
                        placeholder="Description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg text-sm h-20 resize-none focus:ring-2 focus:ring-orange-500"
                      />
                      
                      <input
                        type="text"
                        placeholder="Client (optional)"
                        value={formData.client}
                        onChange={(e) => setFormData({...formData, client: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
                      />
                      
                      <input
                        type="text"
                        placeholder="Year (optional)"
                        value={formData.year}
                        onChange={(e) => setFormData({...formData, year: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
                      />
                      
                      <input
                        type="text"
                        placeholder="Services (comma separated)"
                        value={formData.services}
                        onChange={(e) => setFormData({...formData, services: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
                      />
                      
                      <input
                        type="number"
                        placeholder="Display Order"
                        value={formData.display_order}
                        onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value) || 0})}
                        className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
                      />
                      
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.is_featured}
                          onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
                          className="rounded focus:ring-orange-500"
                        />
                        <span className="text-sm">Featured Project</span>
                      </label>

                      <div className="flex gap-2">
                        <button
                          onClick={saveProject}
                          className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm flex items-center justify-center gap-1"
                        >
                          <Save className="w-4 h-4" />
                          Save
                        </button>
                        <button
                          onClick={() => {setIsEditing(false); resetForm();}}
                          className="flex-1 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm flex items-center justify-center gap-1"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="w-full px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm flex items-center justify-center gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        New Project
                      </button>

                      <div className="space-y-2">
                        {projects.map((project) => (
                          <div key={project.id} className="border rounded-lg p-3">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-medium text-sm">{project.title}</h5>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => startEdit(project)}
                                  className="p-1 text-blue-500 hover:bg-blue-50 rounded"
                                >
                                  <Edit className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => deleteProject(project.id)}
                                  className="p-1 text-red-500 hover:bg-red-50 rounded"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                            
                            <div className="text-xs text-gray-500 mb-2">
                              {project.images?.length || 0} images • {project.category}
                              {project.is_featured && <span className="ml-2 px-1 bg-orange-100 text-orange-600 rounded">Featured</span>}
                            </div>

                            <div className="flex gap-2 mb-2">
                              <label className="flex-1 cursor-pointer">
                                <input
                                  type="file"
                                  multiple
                                  accept="image/*"
                                  onChange={(e) => e.target.files && handleImageUpload(e.target.files, project.id)}
                                  className="hidden"
                                  disabled={isUploading}
                                />
                                <div className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 transition-colors flex items-center justify-center gap-1">
                                  <Upload className="w-3 h-3" />
                                  {isUploading ? 'Uploading...' : 'Add Images'}
                                </div>
                              </label>
                            </div>

                            {project.images && project.images.length > 0 && (
                              <div className="mt-2 grid grid-cols-3 gap-1">
                                {project.images.map((image, index) => (
                                  <div key={image.id} className="relative group">
                                    <img
                                      src={image.image_url}
                                      alt={image.caption || ''}
                                      className="w-full h-12 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                                      onClick={() => openImageModal(project, index)}
                                    />
                                    <button
                                      onClick={() => deleteImage(image.id)}
                                      className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-bl opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <X className="w-2 h-2" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                // Site Content Tab
                <div className="space-y-4">
                  <h4 className="font-bold text-center text-gray-800">Edit Site Content</h4>
                  <p className="text-xs text-gray-600 text-center">
                    Changes save automatically when you click away from a field
                  </p>
                  
                  {Object.keys(groupedContent).length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 text-sm mb-4">No site content found in database.</p>
                      <p className="text-xs text-gray-400">
                        The site_content table needs to be created in Supabase.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {Object.entries(groupedContent).map(([section, items]) => (
                        <div key={section} className="space-y-3">
                          <h5 className="font-semibold text-sm bg-gray-100 px-2 py-1 rounded capitalize flex items-center gap-2">
                            {section === 'hero' && <Home className="w-4 h-4" />}
                            {section === 'about' && <User className="w-4 h-4" />}
                            {section === 'contact' && <Mail className="w-4 h-4" />}
                            {section === 'footer' && <Heart className="w-4 h-4" />}
                            {section.replace('_', ' ')} Section
                          </h5>
                          <div className="space-y-2 pl-2">
                            {items.map((item) => (
                              <div key={`${item.section}.${item.key}`} className="space-y-1">
                                <label className="text-xs text-gray-600 capitalize">
                                  {item.key.replace('_', ' ')}
                                </label>
                                {renderContentEditor(item)}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {showImageModal && selectedProject && selectedProject.images && (
        <div className="fixed inset-0 z-[10000] bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-bold">{selectedProject.title} - Images</h3>
              <button
                onClick={() => setShowImageModal(false)}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4">
              <div className="relative mb-4">
                <img
                  src={selectedProject.images[selectedImageIndex]?.image_url}
                  alt={selectedProject.images[selectedImageIndex]?.caption || ''}
                  className="w-full h-64 object-cover rounded"
                />
                
                {selectedProject.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImageIndex(prev => 
                        prev === 0 ? selectedProject.images!.length - 1 : prev - 1
                      )}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full hover:bg-white"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedImageIndex(prev => 
                        prev === selectedProject.images!.length - 1 ? 0 : prev + 1
                      )}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full hover:bg-white"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Image Caption:</label>
                <input
                  type="text"
                  value={selectedProject.images[selectedImageIndex]?.caption || ''}
                  onChange={(e) => {
                    const imageId = selectedProject.images![selectedImageIndex].id;
                    updateImageCaption(imageId, e.target.value);
                  }}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter image caption..."
                />
              </div>
              
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => {
                    const imageId = selectedProject.images![selectedImageIndex].id;
                    deleteImage(imageId);
                    setShowImageModal(false);
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Image
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminPanel;