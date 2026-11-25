import { inject } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { SvgIcon } from '@jet/types/svg-icon.type';

export function addSvgIcons(svgIcons: SvgIcon[]): void {
  const matIconRegistry = inject(MatIconRegistry);
  const domSanitizer = inject(DomSanitizer);

  for (const svgIcon of svgIcons) {
    if ('data' in svgIcon) {
      matIconRegistry.addSvgIconLiteral(
        svgIcon.name,
        domSanitizer.bypassSecurityTrustHtml(svgIcon.data),
      );
    } else {
      matIconRegistry.addSvgIcon(
        svgIcon.name,
        domSanitizer.bypassSecurityTrustResourceUrl(svgIcon.url),
      );
    }
  }
}
