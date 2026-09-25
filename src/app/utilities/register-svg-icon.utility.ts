import { inject } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

export function registerSvgIcon(name: string, url: string): void {
  const matIconRegistry = inject(MatIconRegistry);
  const domSanitizer = inject(DomSanitizer);

  matIconRegistry.addSvgIcon(name, domSanitizer.bypassSecurityTrustResourceUrl(url));
}
