#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const DIST_PATH = join(process.cwd(), 'dist/jet/browser/index.html');
const ICON_FONT_PATTERN = /fonts\.gstatic\.com\/icon\/font/;

try {
  let html = readFileSync(DIST_PATH, 'utf-8');

  const fontUrlRegex =
    /@font-face\{[^}]*src:url\(([^)]+)\)[^}]*format\(['"]woff2['"]\)/g;

  let match;
  let iconFontUrl;

  while ((match = fontUrlRegex.exec(html)) !== null) {
    if (ICON_FONT_PATTERN.test(match[1])) {
      iconFontUrl = match[1];
      break;
    }
  }

  if (!iconFontUrl) {
    console.warn('No icon font URL found in inline styles.');
    process.exit(0);
  }

  const preloadTag = `<link rel="preload" href="${iconFontUrl}" as="font" type="font/woff2" crossorigin="anonymous">`;
  html = html.replace(/<head>/, `<head>\n    ${preloadTag}`);

  writeFileSync(DIST_PATH, html);

  console.log('Added icon font preload tag to index.html.');
} catch (error) {
  console.warn('Failed to add icon font preload tag:', error.message);
}
