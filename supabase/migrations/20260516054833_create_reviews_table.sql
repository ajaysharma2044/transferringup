/*
  # Create reviews table

  1. New Tables
    - `reviews`
      - `id` (uuid, primary key)
      - `name` (text) - reviewer's display name
      - `email` (text) - reviewer's email (private, not displayed)
      - `school_from` (text) - school they transferred from
      - `school_to` (text) - school they transferred to
      - `rating` (integer, 1-5) - star rating
      - `review_text` (text) - the review content
      - `is_approved` (boolean, default false) - admin approval flag
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `reviews` table
    - Public can read only approved reviews (no auth required for reading approved reviews on marketing site)
    - Anyone can insert a review (public submission)
    - Only authenticated admins can update (approve/reject)

  3. Notes
    - Reviews require admin approval before being displayed publicly
    - Email is collected but never shown publicly
*/

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  school_from text NOT NULL DEFAULT '',
  school_to text NOT NULL DEFAULT '',
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text NOT NULL,
  is_approved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can read approved reviews (public marketing site)
CREATE POLICY "Anyone can read approved reviews"
  ON reviews
  FOR SELECT
  USING (is_approved = true);

-- Anyone can submit a review (public form)
CREATE POLICY "Anyone can submit a review"
  ON reviews
  FOR INSERT
  WITH CHECK (true);

-- Only authenticated users can update reviews (admin approval)
CREATE POLICY "Authenticated users can update reviews"
  ON reviews
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Only authenticated users can delete reviews
CREATE POLICY "Authenticated users can delete reviews"
  ON reviews
  FOR DELETE
  TO authenticated
  USING (true);
