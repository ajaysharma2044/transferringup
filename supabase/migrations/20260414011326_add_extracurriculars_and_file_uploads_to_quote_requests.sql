/*
  # Add extracurriculars and file upload support to quote_requests

  1. Modified Tables
    - `quote_requests`
      - `extracurriculars` (text) - student's extracurricular activities description
      - `file_urls` (text[]) - array of public URLs for uploaded files

  2. Storage
    - Create `quote-attachments` bucket for file uploads
    - Public access enabled so URLs can be shared via Google Sheets

  3. Security
    - Storage policy: anyone can upload files (no auth required for form submissions)
    - Storage policy: anyone can read uploaded files (URLs shared in sheets/email)
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quote_requests' AND column_name = 'extracurriculars'
  ) THEN
    ALTER TABLE quote_requests ADD COLUMN extracurriculars text DEFAULT '';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quote_requests' AND column_name = 'file_urls'
  ) THEN
    ALTER TABLE quote_requests ADD COLUMN file_urls text[] DEFAULT '{}';
  END IF;
END $$;

INSERT INTO storage.buckets (id, name, public)
VALUES ('quote-attachments', 'quote-attachments', true)
ON CONFLICT (id) DO NOTHING;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE policyname = 'Anyone can upload quote attachments'
      AND tablename = 'objects'
      AND schemaname = 'storage'
  ) THEN
    CREATE POLICY "Anyone can upload quote attachments"
      ON storage.objects FOR INSERT
      TO anon, authenticated
      WITH CHECK (bucket_id = 'quote-attachments');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE policyname = 'Anyone can read quote attachments'
      AND tablename = 'objects'
      AND schemaname = 'storage'
  ) THEN
    CREATE POLICY "Anyone can read quote attachments"
      ON storage.objects FOR SELECT
      TO anon, authenticated
      USING (bucket_id = 'quote-attachments');
  END IF;
END $$;
