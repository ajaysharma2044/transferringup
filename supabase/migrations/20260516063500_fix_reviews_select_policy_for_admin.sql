/*
  # Fix reviews SELECT policy for admin access

  1. Security Changes
    - Drop the existing select policy that only allows reading approved reviews
    - Add two new policies:
      - Public (anon) can read only approved reviews
      - Authenticated users can read ALL reviews (for admin panel)

  2. Notes
    - This allows the admin portal to see pending reviews for approval
    - Public visitors still only see approved reviews
*/

DROP POLICY IF EXISTS "Anyone can read approved reviews" ON reviews;

CREATE POLICY "Public can read approved reviews"
  ON reviews
  FOR SELECT
  TO anon
  USING (is_approved = true);

CREATE POLICY "Authenticated users can read all reviews"
  ON reviews
  FOR SELECT
  TO authenticated
  USING (true);
