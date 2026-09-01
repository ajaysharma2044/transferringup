/*
  # Add address and zip code to quote_requests

  1. Modified Tables
    - `quote_requests`
      - `address` (text) - student's street address, city, state
      - `zip_code` (text) - student's zip/postal code
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quote_requests' AND column_name = 'address'
  ) THEN
    ALTER TABLE quote_requests ADD COLUMN address text DEFAULT '';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quote_requests' AND column_name = 'zip_code'
  ) THEN
    ALTER TABLE quote_requests ADD COLUMN zip_code text DEFAULT '';
  END IF;
END $$;
