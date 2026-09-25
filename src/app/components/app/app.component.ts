import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  Component,
  computed,
  DestroyRef,
  DOCUMENT,
  effect,
  inject,
  linkedSignal,
  OnInit,
  Renderer2,
  signal,
  Signal,
  untracked,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { Meta } from '@angular/platform-browser';
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
import { APP_VERSION } from '@jet/constants/app-version.constant';
import { COLOR_SCHEME_OPTIONS } from '@jet/constants/color-scheme-options.constant';
import { DEFAULT_COLOR_SCHEME_OPTION } from '@jet/constants/default-color-scheme-option.constant';
import { DEFAULT_LANGUAGE_OPTION } from '@jet/constants/default-language-option.constant';
import { NAV_ITEMS } from '@jet/constants/nav-items.constant';
import { ColorSchemeOption } from '@jet/interfaces/color-scheme-option.interface';
import { LanguageOption } from '@jet/interfaces/language-option.interface';
import { NavItem } from '@jet/interfaces/nav-item.interface';
import { AlertService } from '@jet/services/alert/alert.service';
import { AnalyticsService } from '@jet/services/analytics/analytics.service';
import { BadgeContentService } from '@jet/services/badge-content/badge-content.service';
import { LoggerService } from '@jet/services/logger/logger.service';
import { ProgressBarService } from '@jet/services/progress-bar/progress-bar.service';
import { SettingsService } from '@jet/services/settings/settings.service';
import { celebrationFillIcon } from '@jet/svgs/celebration-fill';
import { historyFillIcon } from '@jet/svgs/history-fill';
import { homeFillIcon } from '@jet/svgs/home-fill';
import { personFillIcon } from '@jet/svgs/person-fill';
import { tuneFillIcon } from '@jet/svgs/tune-fill';
import { Badge } from '@jet/types/badge.type';
import { addSvgIconLiteral } from '@jet/utilities/add-svg-icon-literal.utility';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { filter } from 'rxjs';
import { FooterComponent } from '../footer/footer.component';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';

@Component({
  imports: [
    MatBadgeModule,
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
  styles: ``,
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  readonly #breakpointObserver = inject(BreakpointObserver);
  readonly #destroyRef = inject(DestroyRef);
  readonly #document = inject(DOCUMENT);
  readonly #renderer2 = inject(Renderer2);
  readonly #meta = inject(Meta);
  readonly #router = inject(Router);
  readonly #alertService = inject(AlertService);
  readonly #analyticsService = inject(AnalyticsService);
  readonly #badgeContentService = inject(BadgeContentService);
  readonly #loggerService = inject(LoggerService);
  readonly #progressBarService = inject(ProgressBarService);
  readonly #settingsService = inject(SettingsService);
  readonly #translocoService = inject(TranslocoService);

  #activeColorSchemeClass: null | string;
  #activeFontPairClass: null | string;
  readonly #colorSchemeOption: Signal<ColorSchemeOption>;
  readonly #isPwaMode: boolean;
  readonly #languageOption: Signal<LanguageOption>;

  protected activeNavItemPath: NavItem['path'] | undefined;
  protected readonly directionality: Signal<LanguageOption['directionality']>;
  protected readonly isLargeViewport: Signal<boolean>;
  protected readonly isMatSidenavOpen: WritableSignal<boolean>;
  protected readonly matSidenavMode: Signal<MatDrawerMode>;
  protected readonly navItems: NavItem[];
  protected readonly shouldAddSafeArea: Signal<boolean>;

  public constructor() {
    addSvgIconLiteral([
      celebrationFillIcon,
      historyFillIcon,
      homeFillIcon,
      personFillIcon,
      tuneFillIcon,
    ]);

    this.#activeColorSchemeClass = null;

    this.#activeFontPairClass = null;

    this.#colorSchemeOption = computed(() => this.#settingsService.settings().colorSchemeOption);

    this.#isPwaMode = this.#breakpointObserver.isMatched('(display-mode: standalone)');

    this.#languageOption = computed(() => this.#settingsService.settings().languageOption);

    this.activeNavItemPath = undefined;

    this.directionality = this.#settingsService.directionality;

    // To continuously listen to viewport changes, set
    // this.isLargeViewport = toSignal(
    //   this.#breakpointObserver
    //     .observe(Breakpoints.Web)
    //     .pipe(map((result) => result.matches)),
    //   { initialValue: false },
    // );
    this.isLargeViewport = signal(this.#breakpointObserver.isMatched(Breakpoints.Web));

    // To keep MatSidenav closed by default on large viewports, set
    // this.isMatSidenavOpen = signal(false);
    // and
    // @defer (on idle) { <jet-sidenav ... /> }
    this.isMatSidenavOpen = linkedSignal(() => this.isLargeViewport());

    this.matSidenavMode = computed(() => (this.isLargeViewport() ? 'side' : 'over'));

    this.navItems = NAV_ITEMS;

    this.shouldAddSafeArea = computed(() =>
      this.matSidenavMode() === 'over' ? true : !this.isMatSidenavOpen(),
    );

    effect(
      () => {
        this.#loggerService.logEffectRun('colorSchemeOption');

        const colorSchemeOption: ColorSchemeOption = this.#colorSchemeOption();

        untracked(() => {
          this.#setColorScheme(colorSchemeOption.value);

          this.#setThemeColorMeta(colorSchemeOption.value);
        });
      },
      { debugName: 'colorSchemeOption' },
    );

    effect(
      () => {
        this.#loggerService.logEffectRun('languageOption');

        const languageOption: LanguageOption = this.#languageOption();

        untracked(() => {
          this.#setFontPairClass(languageOption.fontPairClass);

          this.#setLanguage(languageOption.value);
        });
      },
      { debugName: 'languageOption' },
    );

    this.#loggerService.logComponentInitialization('AppComponent');
  }

  public ngOnInit(): void {
    this.#analyticsService.logAnalyticsEvent({ data: { version: APP_VERSION }, name: 'start' });

    this.#breakpointObserver
      .observe('(prefers-color-scheme: dark)')
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => {
        this.#setThemeColorMeta(this.#colorSchemeOption().value);
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
          this.activeNavItemPath = event.url.split('?')[0];
        }

        if (event instanceof NavigationError) {
          const error = event.error;

          this.#loggerService.logException(error);

          this.#alertService.showExceptionAlert(error);
        }

        this.#progressBarService.hideProgressBar();
      });

    if (this.#isPwaMode) {
      this.#disableUserScalable();
    }
  }

  public getBadgeContent(badge: Badge | null): null | number | string {
    return this.#badgeContentService.getBadgeContent(badge);
  }

  #disableUserScalable(): void {
    this.#meta.updateTag({
      content: 'width=device-width, initial-scale=0.85, user-scalable=no, viewport-fit=cover',
      name: 'viewport',
    });
  }

  #setColorScheme(colorScheme: ColorSchemeOption['value']): void {
    const body: HTMLElement = this.#document.body;

    if (this.#activeColorSchemeClass) {
      body.classList.remove(this.#activeColorSchemeClass);
    }

    if (colorScheme !== DEFAULT_COLOR_SCHEME_OPTION.value) {
      this.#activeColorSchemeClass = `jet-color-scheme-${colorScheme}`;

      body.classList.add(this.#activeColorSchemeClass);
    } else {
      this.#activeColorSchemeClass = null;
    }
  }

  #setFontPairClass(fontPairClass: LanguageOption['fontPairClass']): void {
    const body: HTMLElement = this.#document.body;

    if (this.#activeFontPairClass) {
      body.classList.remove(this.#activeFontPairClass);
    }

    if (fontPairClass !== DEFAULT_LANGUAGE_OPTION.fontPairClass) {
      this.#activeFontPairClass = `jet-font-pair-${fontPairClass}`;

      body.classList.add(this.#activeFontPairClass);
    } else {
      this.#activeFontPairClass = null;
    }
  }

  #setLanguage(language: LanguageOption['value']): void {
    this.#renderer2.setAttribute(this.#document.documentElement, 'lang', language);

    this.#translocoService.setActiveLang(language);
  }

  #setThemeColorMeta(colorScheme: ColorSchemeOption['value']): void {
    colorScheme ??= this.#breakpointObserver.isMatched('(prefers-color-scheme: dark)')
      ? 'dark'
      : 'light';

    const colorSchemeOption: ColorSchemeOption =
      COLOR_SCHEME_OPTIONS.find((colorSchemeOption) => colorSchemeOption.value === colorScheme) ??
      DEFAULT_COLOR_SCHEME_OPTION;

    this.#meta.updateTag({ content: colorSchemeOption.themeColor, name: 'theme-color' });
  }
}
