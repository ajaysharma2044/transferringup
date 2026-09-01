/*
  # Add test score and financial aid columns to form_submissions

  1. Modified Tables
    - `form_submissions`
      - `test_score` (text) - SAT/ACT or other standardized test score
      - `financial_aid` (text) - whether the applicant is applying for financial aid

  2. Notes
    - Both columns default to empty string for backwards compatibility
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'form_submissions' AND column_name = 'test_score'
  ) THEN
    ALTER TABLE form_submissions ADD COLUMN test_score text NOT NULL DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'form_submissions' AND column_name = 'financial_aid'
  ) THEN
    ALTER TABLE form_submissions ADD COLUMN financial_aid text NOT NULL DEFAULT '';
  END IF;
END $$;
