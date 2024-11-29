import { execSync } from 'child_process';
import { join } from 'path';

export default async function globalSetup() {
  const rootDir = join(__dirname, '..');

  execSync('npx prisma migrate deploy', {
    cwd: rootDir,
  });
}
