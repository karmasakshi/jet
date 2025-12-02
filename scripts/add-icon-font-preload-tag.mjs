#!/usr/bin/env node

import { createHash } from 'crypto';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const DIST_PATH = join(process.cwd(), 'dist/jet/browser');
const ICON_FONT_PATTERN = /fonts\.gstatic\.com\/icon\/font/;
const INDEX_PATH = join(DIST_PATH, 'index.html');
const NGSW_PATH = join(DIST_PATH, 'ngsw.json');

try {
  const ngsw = JSON.parse(readFileSync(NGSW_PATH, 'utf-8'));
  const originalHtml = readFileSync(INDEX_PATH, 'utf-8');

  const fontUrlRegex =
    /@font-face\{[^}]*src:url\(([^)]+)\)[^}]*format\(['"]woff2['"]\)/g;

  let match;
  let iconFontUrl;

  while ((match = fontUrlRegex.exec(originalHtml)) !== null) {
    if (ICON_FONT_PATTERN.test(match[1])) {
      iconFontUrl = match[1];
      break;
    }
  }

  if (!iconFontUrl) {
    console.warn('No icon font URL found in inline styles.');
    process.exit(0);
  }

  const preloadTag = `<link as="font" crossorigin="anonymous" href="${iconFontUrl}" rel="preload" type="font/woff2">`;

  const modifiedHtml = originalHtml.replace(
    /<head>/,
    `<head>\n    ${preloadTag}`,
  );

  const newHash = createHash('sha1').update(modifiedHtml).digest('hex');

  if (!ngsw.hashTable?.['/index.html']) {
    console.warn('No index.html hash found in ngsw.json.');
    process.exit(0);
  }

  ngsw.hashTable['/index.html'] = newHash;

  writeFileSync(INDEX_PATH, modifiedHtml);
  writeFileSync(NGSW_PATH, JSON.stringify(ngsw));

  console.log(
    'Added icon font preload tag to index.html and updated hash in ngsw.json.',
  );
} catch (error) {
  console.warn('Failed to add icon font preload tag:', error.message);
}
