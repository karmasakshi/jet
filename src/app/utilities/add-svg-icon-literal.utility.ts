import { inject } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

export function addSvgIconLiteral(icons: { data: string; name: string }[]): void {
  const matIconRegistry = inject(MatIconRegistry);
  const domSanitizer = inject(DomSanitizer);

  for (const { data, name } of icons) {
    matIconRegistry.addSvgIconLiteral(name, domSanitizer.bypassSecurityTrustHtml(data));
  }
}
