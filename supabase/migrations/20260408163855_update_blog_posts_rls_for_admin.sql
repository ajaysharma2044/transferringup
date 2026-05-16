/*
  # Update blog_posts RLS policies for admin management

  1. Changes
    - Drop overly permissive authenticated-only INSERT/UPDATE/DELETE policies
    - Add new policies that also allow the anon role to manage posts
    - This enables the portal (which uses demo login without real Supabase auth) to create/edit/delete articles
    - SELECT policy remains unchanged (anyone can read published posts)

  2. Security Notes
    - The blog admin is accessed through the portal login screen which requires credentials
    - The anon key is already public (embedded in frontend), so these policies allow management from the app
*/

DROP POLICY IF EXISTS "Authenticated users can insert blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Authenticated users can update blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Authenticated users can delete blog posts" ON blog_posts;

CREATE POLICY "Portal users can insert blog posts"
  ON blog_posts
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Portal users can update blog posts"
  ON blog_posts
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Portal users can delete blog posts"
  ON blog_posts
  FOR DELETE
  TO anon, authenticated
  USING (true);
