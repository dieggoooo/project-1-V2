-- ── Fix 1: Restrict airlines SELECT to safe columns only ─────────────────────
-- The broad "Anyone can read airlines for signup" policy exposed the settings
-- JSONB column (which stores third-party API tokens) to anon + authenticated
-- users. Replace it with a view that projects only the safe columns.

DROP POLICY IF EXISTS "Anyone can read airlines for signup" ON airlines;

-- Public view used by the sign-up page to populate the airline dropdown.
-- Only id, name, code are exposed — settings (API credentials) are excluded.
CREATE OR REPLACE VIEW public.airlines_public AS
  SELECT id, name, code FROM airlines;

GRANT SELECT ON public.airlines_public TO anon, authenticated;

-- ── Fix 2: Prevent role escalation on profile insert ─────────────────────────
-- The previous INSERT policy only checked id = auth.uid(), so a user could
-- POST directly to Supabase with role = 'admin' and gain elevated privileges.
-- The replacement policy pins the role to 'flight_attendant' on insert.

DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid() AND role = 'flight_attendant');
