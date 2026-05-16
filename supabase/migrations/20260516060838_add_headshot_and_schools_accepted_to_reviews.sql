/*
  # Add headshot and schools accepted to reviews

  1. Modified Tables
    - `reviews`
      - `headshot_url` (text) - URL to uploaded headshot/selfie image
      - `schools_accepted` (text) - comma-separated list of schools the client was accepted to

  2. Storage
    - Create `review-headshots` bucket for photo uploads
    - Public read access for approved headshot images

  3. Notes
    - headshot_url is optional (clients may or may not upload a photo)
    - schools_accepted is a free-text field for listing multiple schools
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reviews' AND column_name = 'headshot_url'
  ) THEN
    ALTER TABLE reviews ADD COLUMN headshot_url text DEFAULT '';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reviews' AND column_name = 'schools_accepted'
  ) THEN
    ALTER TABLE reviews ADD COLUMN schools_accepted text DEFAULT '';
  END IF;
END $$;

-- Create storage bucket for review headshots
INSERT INTO storage.buckets (id, name, public)
VALUES ('review-headshots', 'review-headshots', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to upload to the review-headshots bucket
CREATE POLICY "Anyone can upload review headshots"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'review-headshots');

-- Allow public read access to review headshots
CREATE POLICY "Public read access for review headshots"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'review-headshots');
