#!/usr/bin/env node
// Capacitor static build helper.
// Temporarily hides app/api (server routes) so Next.js output:'export'
// doesn't fail on dynamic route handlers, then restores them after.
const { execSync } = require('child_process');
const { renameSync, existsSync } = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const apiDir = path.join(root, 'app', 'api');
const hiddenDir = path.join(root, 'app', '_api');

const hidden = existsSync(hiddenDir);
if (!hidden && existsSync(apiDir)) {
  renameSync(apiDir, hiddenDir);
}

try {
  execSync('cross-env CAPACITOR=true next build', { stdio: 'inherit', cwd: root });
} finally {
  if (!hidden && existsSync(hiddenDir)) {
    renameSync(hiddenDir, apiDir);
  }
}
