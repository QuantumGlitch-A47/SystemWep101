/*
  # Portfolio Database Schema

  1. New Tables
    - `projects`
      - `id` (bigserial, primary key) - Unique project identifier
      - `title` (text, required) - Project title
      - `category` (text, required) - Project category
      - `category_tag` (text, required) - Short category tag for display
      - `description` (text, required) - Project description
      - `image` (text) - Project image URL or filename
      - `technologies` (text[]) - Array of technology names
      - `status` (text, required) - Project status (e.g., "In Development")
      - `link` (text) - Project detail page link
      - `hidden` (boolean, default false) - Whether project is hidden from display
      - `deleted` (boolean, default false) - Soft delete flag
      - `display_order` (integer, default 0) - Order for displaying projects
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

    - `contact_messages`
      - `id` (bigserial, primary key) - Unique message identifier
      - `name` (text, required) - Sender name
      - `email` (text, required) - Sender email
      - `message` (text, required) - Message content
      - `created_at` (timestamptz) - Submission timestamp
      - `read` (boolean, default false) - Whether message has been read

  2. Security
    - Enable RLS on both tables
    - Public read access for non-deleted, non-hidden projects
    - Authenticated write access for projects management
    - Public insert access for contact messages
    - Authenticated read access for contact messages
*/

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id bigserial PRIMARY KEY,
  title text NOT NULL,
  category text NOT NULL,
  category_tag text NOT NULL,
  description text NOT NULL,
  image text,
  technologies text[] DEFAULT '{}',
  status text NOT NULL,
  link text,
  hidden boolean DEFAULT false,
  deleted boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id bigserial PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now(),
  read boolean DEFAULT false
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Projects policies
CREATE POLICY "Public can view active projects"
  ON projects FOR SELECT
  USING (deleted = false AND hidden = false);

CREATE POLICY "Authenticated users can view all projects"
  ON projects FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete projects"
  ON projects FOR DELETE
  TO authenticated
  USING (true);

-- Contact messages policies
CREATE POLICY "Anyone can submit contact messages"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view contact messages"
  ON contact_messages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update contact messages"
  ON contact_messages FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create index for ordering projects
CREATE INDEX IF NOT EXISTS idx_projects_display_order ON projects(display_order);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);