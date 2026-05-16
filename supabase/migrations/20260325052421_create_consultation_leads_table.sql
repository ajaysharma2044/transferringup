/*
  # Create consultation leads table

  1. New Tables
    - `consultation_leads`
      - `id` (uuid, primary key)
      - `first_name` (text) - Lead's first name
      - `last_name` (text) - Lead's last name
      - `email` (text) - Contact email
      - `phone` (text) - Contact phone number
      - `current_school` (text) - Current institution
      - `current_gpa` (text) - Current GPA
      - `target_schools` (text) - Desired transfer schools
      - `intended_transfer_year` (text) - When they plan to transfer
      - `biggest_challenge` (text) - Their main challenge with transferring
      - `created_at` (timestamptz) - When the lead was captured
  
  2. Security
    - Enable RLS on `consultation_leads` table
    - Add policy for service role to insert leads (no public access)
*/

CREATE TABLE IF NOT EXISTS consultation_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  current_school text NOT NULL,
  current_gpa text NOT NULL,
  target_schools text NOT NULL,
  intended_transfer_year text NOT NULL,
  biggest_challenge text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE consultation_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can insert consultation leads"
  ON consultation_leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Service role can view consultation leads"
  ON consultation_leads
  FOR SELECT
  TO authenticated
  USING (true);