/*
  # Create quote_requests table

  1. New Tables
    - `quote_requests`
      - `id` (uuid, primary key)
      - `first_name` (text) - Student's first name
      - `last_name` (text) - Student's last name
      - `email` (text) - Contact email
      - `phone` (text) - Contact phone
      - `current_school` (text) - Where the student currently attends
      - `college_gpa` (text) - Current college GPA
      - `high_school_gpa` (text) - High school GPA
      - `target_schools` (text) - Dream schools to transfer to
      - `intended_major` (text) - What they want to study
      - `transfer_term` (text) - When they plan to transfer (e.g., Fall 2026)
      - `test_score` (text) - SAT/ACT scores
      - `financial_aid` (text) - Whether they need financial aid
      - `num_schools` (text) - How many schools they plan to apply to
      - `services_interested` (text) - Which services they are interested in
      - `biggest_challenge` (text) - Main struggle or concern
      - `additional_info` (text) - Any other context
      - `status` (text) - Internal status tracking (new, contacted, quoted, closed)
      - `created_at` (timestamptz) - When the request was submitted

  2. Security
    - Enable RLS on `quote_requests` table
    - Add INSERT policy for anonymous users (public form submissions)
    - Add SELECT/UPDATE policies for authenticated admin users
*/

CREATE TABLE IF NOT EXISTS quote_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL DEFAULT '',
  last_name text NOT NULL DEFAULT '',
  email text NOT NULL,
  phone text NOT NULL DEFAULT '',
  current_school text NOT NULL DEFAULT '',
  college_gpa text NOT NULL DEFAULT '',
  high_school_gpa text NOT NULL DEFAULT '',
  target_schools text NOT NULL DEFAULT '',
  intended_major text NOT NULL DEFAULT '',
  transfer_term text NOT NULL DEFAULT '',
  test_score text NOT NULL DEFAULT '',
  financial_aid text NOT NULL DEFAULT '',
  num_schools text NOT NULL DEFAULT '',
  services_interested text NOT NULL DEFAULT '',
  biggest_challenge text NOT NULL DEFAULT '',
  additional_info text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a quote request"
  ON quote_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view quote requests"
  ON quote_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update quote requests"
  ON quote_requests
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);
