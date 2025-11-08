import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  linkedSignal,
  OnDestroy,
  OnInit,
  Renderer2,
  Signal,
  untracked,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { DomSanitizer, Meta } from '@angular/platform-browser';
import {
  Event,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { COLOR_SCHEME_OPTIONS } from '@jet/constants/color-scheme-options.constant';
import { DEFAULT_COLOR_SCHEME_OPTION } from '@jet/constants/default-color-scheme-option.constant';
import { DEFAULT_LANGUAGE_OPTION } from '@jet/constants/default-language-option.constant';
import { NAVIGATION_MENU_ITEMS } from '@jet/constants/navigation-menu-items.constant';
import { ColorSchemeOption } from '@jet/interfaces/color-scheme-option.interface';
import { LanguageOption } from '@jet/interfaces/language-option.interface';
import { NavigationMenuItem } from '@jet/interfaces/navigation-menu-item.interface';
import { AlertService } from '@jet/services/alert/alert.service';
import { AnalyticsService } from '@jet/services/analytics/analytics.service';
import { LoggerService } from '@jet/services/logger/logger.service';
import { ProgressBarService } from '@jet/services/progress-bar/progress-bar.service';
import { SettingsService } from '@jet/services/settings/settings.service';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import packageJson from 'package.json';
import { filter, map } from 'rxjs';
import { FooterComponent } from '../footer/footer.component';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatIconModule,
    MatSidenavModule,
    MatTabsModule,
    RouterLink,
    RouterOutlet,
    TranslocoModule,
    FooterComponent,
    SidenavComponent,
    ToolbarComponent,
  ],
  selector: 'jet-app',
  styleUrl: './app.component.scss',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnDestroy, OnInit {
  readonly #breakpointObserver = inject(BreakpointObserver);
  readonly #document = inject(DOCUMENT);
  readonly #destroyRef = inject(DestroyRef);
  readonly #renderer2 = inject(Renderer2);
  readonly #matIconRegistry = inject(MatIconRegistry);
  readonly #domSanitizer = inject(DomSanitizer);
  readonly #meta = inject(Meta);
  readonly #router = inject(Router);
  readonly #alertService = inject(AlertService);
  readonly #analyticsService = inject(AnalyticsService);
  readonly #loggerService = inject(LoggerService);
  readonly #progressBarService = inject(ProgressBarService);
  readonly #settingsService = inject(SettingsService);
  readonly #translocoService = inject(TranslocoService);

  readonly #colorSchemeOption: Signal<ColorSchemeOption>;
  readonly #darkColorSchemeEventListener: () => void;
  readonly #darkColorSchemeMediaQueryList: MediaQueryList;
  readonly #isPwaMode: boolean;
  readonly #languageOption: Signal<LanguageOption>;

  public activeNavigationMenuItemPath: NavigationMenuItem['path'] | undefined;
  public readonly directionality: Signal<LanguageOption['directionality']>;
  public readonly isLargeViewport: Signal<boolean>;
  public readonly isMatSidenavOpen: WritableSignal<boolean>;
  public readonly matSidenavMode: Signal<MatDrawerMode>;
  public readonly navigationMenuItems: NavigationMenuItem[];
  public readonly shouldAddSafeArea: Signal<boolean>;

  public constructor() {
    this.#colorSchemeOption = computed(
      () => this.#settingsService.settings().colorSchemeOption,
    );

    this.#darkColorSchemeMediaQueryList = window.matchMedia(
      '(prefers-color-scheme: dark)',
    );

    this.#darkColorSchemeEventListener = this.#renderer2.listen(
      this.#darkColorSchemeMediaQueryList,
      'change',
      (darkColorSchemeMediaQueryList: MediaQueryListEvent) => {
        if (this.#colorSchemeOption().value === 'automatic') {
          this.#setThemeColor(
            darkColorSchemeMediaQueryList.matches ? 'dark' : 'light',
          );
        }
      },
    );

    this.#isPwaMode = window.matchMedia('(display-mode: standalone)').matches;

    this.#languageOption = computed(
      () => this.#settingsService.settings().languageOption,
    );

    this.activeNavigationMenuItemPath = undefined;

    this.directionality = this.#settingsService.directionality;

    this.isLargeViewport = toSignal(
      this.#breakpointObserver
        .observe(Breakpoints.Web)
        .pipe(map((result) => result.matches)),
      { initialValue: false },
    );

    this.isMatSidenavOpen = linkedSignal(() => this.isLargeViewport());

    this.matSidenavMode = computed(() => {
      return this.isLargeViewport() ? 'side' : 'over';
    });

    this.navigationMenuItems = NAVIGATION_MENU_ITEMS;

    this.shouldAddSafeArea = computed(() => {
      return this.matSidenavMode() === 'over' ? true : !this.isMatSidenavOpen();
    });

    effect(
      () => {
        this.#loggerService.logEffectRun('colorSchemeOption');

        const colorSchemeOption: ColorSchemeOption = this.#colorSchemeOption();

        untracked(() => {
          this.#setColorScheme(colorSchemeOption.value);

          if (colorSchemeOption.value === 'automatic') {
            this.#setThemeColor(
              this.#darkColorSchemeMediaQueryList.matches ? 'dark' : 'light',
            );
          } else {
            this.#setThemeColor(colorSchemeOption.value);
          }
        });
      },
      { debugName: 'colorSchemeOption' },
    );

    effect(
      () => {
        this.#loggerService.logEffectRun('languageOption');

        const languageOption: LanguageOption = this.#languageOption();

        untracked(() => {
          this.#loadFontPair(languageOption.fontPairUrl);
          this.#setFontPair(languageOption.fontPair);
          this.#setLanguage(languageOption.value);
        });
      },
      { debugName: 'languageOption' },
    );

    this.#loggerService.logComponentInitialization('AppComponent');
  }

  public ngOnDestroy(): void {
    this.#darkColorSchemeEventListener();
  }

  public ngOnInit(): void {
    this.#analyticsService.logEvent('Start', {
      version: `v${packageJson.version}`,
    });

    this.#router.events
      .pipe(
        filter(
          (event: Event) =>
            event instanceof NavigationStart ||
            event instanceof NavigationCancel ||
            event instanceof NavigationEnd ||
            event instanceof NavigationError,
        ),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe((event: Event) => {
        if (event instanceof NavigationStart) {
          this.#progressBarService.showQueryProgressBar();
          return;
        }

        if (event instanceof NavigationEnd) {
          this.activeNavigationMenuItemPath = event.url.split('?')[0];
        }

        if (event instanceof NavigationError) {
          const error = event.error;
          const message: string | undefined =
            error instanceof Error ? error.message : undefined;

          this.#loggerService.logError(error);
          this.#alertService.showErrorAlert(message);
        }

        this.#progressBarService.hideProgressBar();
      });

    this.#setIcons();

    this.#setZoom(this.#isPwaMode);
  }

  #loadFontPair(fontPairUrl: LanguageOption['fontPairUrl']): void {
    const id: string = 'jet-non-default-font-pair';

    let linkElement: HTMLElement | null = document.getElementById(id);

    if (linkElement) {
      this.#renderer2.removeChild(this.#document.head, linkElement);
    }

    if (fontPairUrl !== DEFAULT_LANGUAGE_OPTION.fontPairUrl) {
      linkElement = this.#renderer2.createElement('link');
      this.#renderer2.setAttribute(linkElement, 'href', fontPairUrl);
      this.#renderer2.setAttribute(linkElement, 'id', id);
      this.#renderer2.setAttribute(linkElement, 'rel', 'stylesheet');
      this.#renderer2.appendChild(this.#document.head, linkElement);
    }
  }

  #setColorScheme(colorScheme: ColorSchemeOption['value']): void {
    const prefix: string = 'jet-color-scheme-';

    requestAnimationFrame(() => {
      const body: HTMLElement = this.#document.body;

      body.className = body.className
        .replace(new RegExp(`${prefix}\\S+`, 'g'), '')
        .trim();

      if (colorScheme !== DEFAULT_COLOR_SCHEME_OPTION.value) {
        body.classList.add(prefix + colorScheme);
      }
    });
  }

  #setFontPair(fontPair: LanguageOption['fontPair']): void {
    const prefix: string = 'jet-font-pair-';

    requestAnimationFrame(() => {
      const body: HTMLElement = this.#document.body;

      body.className = body.className
        .replace(new RegExp(`${prefix}\\S+`, 'g'), '')
        .trim();

      if (fontPair !== DEFAULT_LANGUAGE_OPTION.fontPair) {
        body.classList.add(prefix + fontPair);
      }
    });
  }

  #setIcons(): void {
    this.#matIconRegistry.setDefaultFontSetClass('material-symbols-rounded');

    this.#matIconRegistry.addSvgIcon(
      'logo',
      this.#domSanitizer.bypassSecurityTrustResourceUrl('./images/logo.svg'),
    );
  }

  #setLanguage(language: LanguageOption['value']): void {
    this.#renderer2.setAttribute(
      this.#document.documentElement,
      'lang',
      language,
    );

    this.#translocoService.setActiveLang(language);
  }

  #setThemeColor(
    colorScheme: Omit<ColorSchemeOption['value'], 'automatic'>,
  ): void {
    const colorSchemeOption: ColorSchemeOption =
      COLOR_SCHEME_OPTIONS.find(
        (colorSchemeOption) => colorSchemeOption.value === colorScheme,
      ) ?? DEFAULT_COLOR_SCHEME_OPTION;

    this.#meta.updateTag({
      content: colorSchemeOption.themeColor,
      name: 'theme-color',
    });
  }

  #setZoom(isPwaMode: boolean): void {
    if (isPwaMode) {
      this.#meta.updateTag({
        content:
          'width=device-width, initial-scale=0.75, viewport-fit=cover, user-scalable=no',
        name: 'viewport',
      });
    }
  }
}
