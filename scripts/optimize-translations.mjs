#!/usr/bin/env node

import { execSync } from 'child_process';
import { createHash } from 'crypto';
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const DIST_PATH = join(process.cwd(), 'dist/jet/browser');
const I18N_PATH = join(DIST_PATH, 'i18n');
const NGSW_PATH = join(DIST_PATH, 'ngsw.json');

try {
  const ngsw = JSON.parse(readFileSync(NGSW_PATH, 'utf-8'));
  const files = readdirSync(I18N_PATH).filter((f) => f.endsWith('.json'));

  const filesToUpdate = files.filter((f) => ngsw.hashTable?.[`/i18n/${f}`]);

  if (filesToUpdate.length === 0) {
    console.warn('No translation hashes found in ngsw.json.');
    process.exit(0);
  }

  execSync(`transloco-optimize ${I18N_PATH}`, { stdio: 'inherit' });

  for (const file of filesToUpdate) {
    const content = readFileSync(join(I18N_PATH, file), 'utf-8');
    const newHash = createHash('sha1').update(content).digest('hex');

    ngsw.hashTable[`/i18n/${file}`] = newHash;
  }

  writeFileSync(NGSW_PATH, JSON.stringify(ngsw));

  console.log(
    `Optimized translations and updated ${filesToUpdate.length} hash(es) in ngsw.json.`,
  );
} catch (error) {
  console.warn('Failed to optimize translations:', error.message);
}
