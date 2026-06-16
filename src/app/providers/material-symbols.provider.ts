import { EnvironmentProviders, inject, provideEnvironmentInitializer } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

export function provideMaterialSymbols(
  icons: { data: string; name: string }[],
): EnvironmentProviders {
  return provideEnvironmentInitializer(() => {
    const matIconRegistry = inject(MatIconRegistry);
    const domSanitizer = inject(DomSanitizer);

    matIconRegistry.addSvgIcon(
      'logo',
      domSanitizer.bypassSecurityTrustResourceUrl('./media/logo.svg'),
    );

    for (const { data, name } of icons) {
      matIconRegistry.addSvgIconLiteral(name, domSanitizer.bypassSecurityTrustHtml(data));
    }
  });
}
