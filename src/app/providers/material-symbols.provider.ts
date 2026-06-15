import { EnvironmentProviders, inject, provideEnvironmentInitializer } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { settingsFillIcon } from '@jet/svgs/settings-fill';

export function provideMaterialSymbols(): EnvironmentProviders {
  return provideEnvironmentInitializer(() => {
    const matIconRegistry = inject(MatIconRegistry);
    const domSanitizer = inject(DomSanitizer);

    matIconRegistry.setDefaultFontSetClass('material-symbols-rounded');

    matIconRegistry.addSvgIconLiteral(
      'settings',
      domSanitizer.bypassSecurityTrustHtml(settingsFillIcon.data),
    );
  });
}
