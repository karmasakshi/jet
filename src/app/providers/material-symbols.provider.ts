import { EnvironmentProviders, inject, provideEnvironmentInitializer } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { alternateEmailFillIcon } from '@jet/svgs/alternate_email-fill';
import { closeFillIcon } from '@jet/svgs/close-fill';
import { contrastFillIcon } from '@jet/svgs/contrast-fill';
import { darkModeFillIcon } from '@jet/svgs/dark_mode-fill';
import { homeFillIcon } from '@jet/svgs/home-fill';
import { languageFillIcon } from '@jet/svgs/language-fill';
import { lightModeFillIcon } from '@jet/svgs/light_mode-fill';
import { paletteFillIcon } from '@jet/svgs/palette-fill';
import { personFillIcon } from '@jet/svgs/person-fill';
import { refreshFillIcon } from '@jet/svgs/refresh-fill';
import { restartAltFillIcon } from '@jet/svgs/restart_alt-fill';
import { settingsFillIcon } from '@jet/svgs/settings-fill';
import { shortTextFillIcon } from '@jet/svgs/short_text-fill';
import { syncFillIcon } from '@jet/svgs/sync-fill';
import { translateFillIcon } from '@jet/svgs/translate-fill';
import { visibilityFillIcon } from '@jet/svgs/visibility-fill';
import { visibilityOffFillIcon } from '@jet/svgs/visibility_off-fill';

const MATERIAL_SYMBOLS: Record<string, Record<'data', string>> = {
  alternate_email: alternateEmailFillIcon,
  close: closeFillIcon,
  contrast: contrastFillIcon,
  dark_mode: darkModeFillIcon,
  home: homeFillIcon,
  language: languageFillIcon,
  light_mode: lightModeFillIcon,
  palette: paletteFillIcon,
  person: personFillIcon,
  refresh: refreshFillIcon,
  restart_alt: restartAltFillIcon,
  settings: settingsFillIcon,
  short_text: shortTextFillIcon,
  sync: syncFillIcon,
  translate: translateFillIcon,
  visibility: visibilityFillIcon,
  visibility_off: visibilityOffFillIcon,
};

export function provideMaterialSymbols(): EnvironmentProviders {
  return provideEnvironmentInitializer(() => {
    const matIconRegistry = inject(MatIconRegistry);
    const domSanitizer = inject(DomSanitizer);

    matIconRegistry.addSvgIcon(
      'logo',
      domSanitizer.bypassSecurityTrustResourceUrl('./images/logo.svg'),
    );

    for (const [name, icon] of Object.entries(MATERIAL_SYMBOLS)) {
      matIconRegistry.addSvgIconLiteral(name, domSanitizer.bypassSecurityTrustHtml(icon.data));
    }
  });
}
