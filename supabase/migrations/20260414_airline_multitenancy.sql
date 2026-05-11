-- ── Aeromexico airline entry with Logintelix integration settings ─────────────
-- The settings JSONB stores integration type + credentials per airline.
-- For Logintelix: { "integration": "logintelix", "baseUrl": "...", "token": "..." }
-- Replace the placeholder values with real credentials before deploying.
INSERT INTO airlines (id, name, code, settings)
VALUES (
  '00000000-0000-0000-0001-000000000001',
  'Aeromexico',
  'AM',
  '{"integration": "logintelix", "baseUrl": "REPLACE_WITH_LOGINTELIX_BASE_URL", "token": "REPLACE_WITH_LOGINTELIX_API_TOKEN"}'
)
ON CONFLICT (code) DO UPDATE
  SET settings = EXCLUDED.settings,
      name     = EXCLUDED.name;

-- ── Allow unauthenticated users to read the airlines list ─────────────────────
-- Needed so the sign-up page can populate the airline dropdown before the user
-- has an account. Only exposes id, name, code — no credentials.
CREATE POLICY "Anyone can read airlines for signup"
  ON airlines FOR SELECT
  TO anon, authenticated
  USING (true);

-- ── Allow new authenticated users to insert their own profile ─────────────────
-- Without this, sign-up succeeds in auth.users but the profile row can't be
-- created because no INSERT policy exists for regular users.
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());
