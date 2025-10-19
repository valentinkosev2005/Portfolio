/*
  # Complete Site Structure Setup

  1. New Tables
    - `site_content` - For managing all site text content
    - Enhanced `projects` and `project_images` tables with better structure

  2. Security
    - Enable RLS on all tables
    - Admin-only policies for content management
    - Public read access for site visitors

  3. Initial Data
    - Populate site_content with default values
    - Set up proper indexes for performance
*/

-- Create site_content table
CREATE TABLE IF NOT EXISTS site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL,
  key text NOT NULL,
  value text NOT NULL,
  type text DEFAULT 'text' CHECK (type IN ('text', 'textarea', 'url', 'boolean', 'json')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(section, key)
);

-- Enable RLS
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admin can manage site content"
  ON site_content
  FOR ALL
  TO authenticated
  USING ((jwt() ->> 'email'::text) = 'vampixwork@gmail.com'::text);

CREATE POLICY "Anyone can view site content"
  ON site_content
  FOR SELECT
  TO public
  USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_site_content_section ON site_content(section);
CREATE INDEX IF NOT EXISTS idx_site_content_section_key ON site_content(section, key);

-- Insert default site content
INSERT INTO site_content (section, key, value, type) VALUES
-- Hero Section
('hero', 'greeting', 'Available for new projects', 'text'),
('hero', 'name', 'Valentin Kosev', 'text'),
('hero', 'tagline', 'I turn wild ideas into visual stories that make people stop scrolling', 'textarea'),
('hero', 'description', 'Creative director & graphic designer from Sofia, Bulgaria. Specializing in brands that dare to be different.', 'textarea'),
('hero', 'cta_primary', 'See My Work', 'text'),
('hero', 'cta_secondary', 'Let''s Create Magic', 'text'),
('hero', 'stats_projects', '50+', 'text'),
('hero', 'stats_years', '5+', 'text'),
('hero', 'stats_clients', '30+', 'text'),

-- About Section
('about', 'title', 'Behind The Creative Mind', 'text'),
('about', 'subtitle', 'I''m not just a designer—I''m a visual problem solver who believes great design can change the world, one project at a time.', 'textarea'),
('about', 'story_title', 'From Dreamer to Creative Director', 'text'),
('about', 'story_p1', 'My journey started with a simple belief: design should make people feel something. Whether it''s excitement, trust, or pure joy—every pixel should have a purpose.', 'textarea'),
('about', 'story_p2', 'Based in the vibrant city of Sofia, Bulgaria, I''ve had the privilege of working with incredible clients who aren''t afraid to think different and be bold.', 'textarea'),
('about', 'story_p3', 'When I''m not crafting visual stories, you''ll find me exploring new design trends, drinking way too much coffee ☕, and constantly asking "What if we tried this instead?"', 'textarea'),
('about', 'image_url', 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600', 'url'),

-- Contact Section
('contact', 'title', 'Ready To Create Something Amazing?', 'text'),
('contact', 'subtitle', 'I''m always excited to work on new projects and collaborate with creative minds. Let''s turn your vision into reality.', 'textarea'),
('contact', 'email', 'vampixwork@gmail.com', 'text'),
('contact', 'phone', '+359 89 034 2280', 'text'),
('contact', 'location', 'Sofia, Bulgaria', 'text'),
('contact', 'instagram', '@vk_creative.designs', 'text'),
('contact', 'instagram_url', 'https://www.instagram.com/vk_creative.designs?igsh=MWkzeXc1NHprZHFodQ==', 'url'),

-- Footer Section
('footer', 'description', 'Creating meaningful visual experiences that connect brands with their audiences. Based in Sofia, Bulgaria, working with clients worldwide.', 'textarea'),
('footer', 'copyright', 'VK Designs. All rights reserved.', 'text')

ON CONFLICT (section, key) DO NOTHING;

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_site_content_updated_at'
    ) THEN
        CREATE TRIGGER update_site_content_updated_at
            BEFORE UPDATE ON site_content
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;