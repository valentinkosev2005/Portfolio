/*
  # Create Projects and Images Management System

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `title` (text)
      - `category` (text)
      - `description` (text)
      - `client` (text, optional)
      - `year` (text, optional)
      - `services` (text array, optional)
      - `is_featured` (boolean, default false)
      - `display_order` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `project_images`
      - `id` (uuid, primary key)
      - `project_id` (uuid, foreign key)
      - `image_url` (text)
      - `caption` (text, optional)
      - `display_order` (integer, default 0)
      - `created_at` (timestamp)

  2. Storage
    - Create storage bucket for project images
    - Set up RLS policies for admin-only access

  3. Security
    - Enable RLS on both tables
    - Admin-only policies for CUD operations
    - Public read access for displaying projects
*/

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  client text,
  year text,
  services text[],
  is_featured boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create project_images table
CREATE TABLE IF NOT EXISTS project_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  caption text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create storage bucket for project images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;

-- Public read access for projects
CREATE POLICY "Anyone can view projects"
  ON projects
  FOR SELECT
  TO public
  USING (true);

-- Public read access for project images
CREATE POLICY "Anyone can view project images"
  ON project_images
  FOR SELECT
  TO public
  USING (true);

-- Admin-only policies for projects (replace 'your-admin-email@example.com' with your actual email)
CREATE POLICY "Admin can manage projects"
  ON projects
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'vampixwork@gmail.com');

-- Admin-only policies for project images
CREATE POLICY "Admin can manage project images"
  ON project_images
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'vampixwork@gmail.com');

-- Storage policies for project images bucket
CREATE POLICY "Anyone can view project images in storage"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'project-images');

CREATE POLICY "Admin can upload project images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'project-images' AND
    auth.jwt() ->> 'email' = 'vampixwork@gmail.com'
  );

CREATE POLICY "Admin can update project images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'project-images' AND
    auth.jwt() ->> 'email' = 'vampixwork@gmail.com'
  );

CREATE POLICY "Admin can delete project images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'project-images' AND
    auth.jwt() ->> 'email' = 'vampixwork@gmail.com'
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(is_featured);
CREATE INDEX IF NOT EXISTS idx_projects_display_order ON projects(display_order);
CREATE INDEX IF NOT EXISTS idx_project_images_project_id ON project_images(project_id);
CREATE INDEX IF NOT EXISTS idx_project_images_display_order ON project_images(display_order);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();