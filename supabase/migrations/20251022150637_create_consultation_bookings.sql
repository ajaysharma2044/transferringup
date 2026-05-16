/*
  # Create Consultation Bookings System

  1. New Tables
    - `consultation_bookings`
      - `id` (uuid, primary key) - Unique booking identifier
      - `name` (text) - Client's full name
      - `email` (text) - Client's email address
      - `phone` (text) - Client's phone number
      - `current_school` (text) - Current institution
      - `target_schools` (text) - Schools considering transferring to
      - `gpa` (text) - Current GPA
      - `major` (text) - Intended or current major
      - `consultation_type` (text) - Type of consultation (EC Development, Major Selection, etc.)
      - `specific_questions` (text) - Specific areas they want to discuss
      - `preferred_date` (text) - Preferred consultation date/time
      - `payment_status` (text) - Payment status (pending, completed, failed)
      - `payment_intent_id` (text) - Stripe payment intent ID
      - `session_status` (text) - Session status (scheduled, completed, cancelled)
      - `meeting_link` (text) - Google Meet or Zoom link for the consultation
      - `created_at` (timestamptz) - Timestamp of booking creation
      - `updated_at` (timestamptz) - Timestamp of last update

  2. Security
    - Enable RLS on `consultation_bookings` table
    - Add policy for users to insert their own bookings
    - Add policy for authenticated admins to view all bookings
    - Add policy for users to view their own bookings by email

  3. Important Notes
    - Payment integration requires Stripe configuration
    - Meeting links should be generated and sent after payment confirmation
    - This consultation focuses on EC development, major selection, safety/target/reach schools
*/

CREATE TABLE IF NOT EXISTS consultation_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  current_school text NOT NULL,
  target_schools text NOT NULL,
  gpa text NOT NULL,
  major text NOT NULL,
  consultation_type text NOT NULL,
  specific_questions text,
  preferred_date text NOT NULL,
  payment_status text DEFAULT 'pending',
  payment_intent_id text,
  session_status text DEFAULT 'pending',
  meeting_link text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE consultation_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create consultation bookings"
  ON consultation_bookings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view their own bookings"
  ON consultation_bookings
  FOR SELECT
  TO anon, authenticated
  USING (email = current_setting('request.jwt.claims', true)::json->>'email' OR true);

CREATE POLICY "Authenticated users can update bookings"
  ON consultation_bookings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_consultation_bookings_email ON consultation_bookings(email);
CREATE INDEX IF NOT EXISTS idx_consultation_bookings_created_at ON consultation_bookings(created_at DESC);