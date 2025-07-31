# Jet

Angular starter-kit for building quality web apps fast.

<br />

<p align="center">
  <img
    alt="Logo"
    src="./public/icons/jet.svg"
    width="64"
  />
</p>

## Sponsors

<p align="center">
  <img
    alt="byjokese"
    src="https://github.com/byjokese.png"
    width="64"
  />
  &nbsp;
  <img
    alt="dipenpradhan"
    src="https://github.com/dipenpradhan.png"
    width="64"
  />
  &nbsp;
  <img
    alt="lohiaad"
    src="https://github.com/lohiaad.png"
    width="64"
  />
  &nbsp;
  <img
    alt="singhamit089"
    src="https://github.com/singhamit089.png"
    width="64"
  />
</p>

Support development of Jet. [Pay what you like](https://karmasakshi.lemonsqueezy.com/buy/b4db1f83-66be-426d-b286-985b1e6b13ce).

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.

## Contents

- [Features](#features)
  - [Integrations](#integrations)
  - [Components](#components)
  - [Constants](#constants)
  - [Directives](#directives)
  - [Enums](#enums)
  - [Guards](#guards)
  - [Interceptors](#interceptors)
  - [Services](#services)
  - [GitHub Actions](#github-actions)
  - [GitHub Issue Templates](#github-issue-templates)
- [Guides](#guides)
  - [Get started](#get-started)
  - [Add elements](#add-elements)
    - [Add a component](#add-a-component)
    - [Add a page component](#add-a-page-component)
    - [Add a service](#add-a-service)
  - [Manage code](#manage-code)
    - [Format code](#format-code)
    - [Lint code](#lint-code)
    - [Test code](#test-code)
    - [Commit code](#commit-code)
    - [Update commit scopes](#update-commit-scopes)
    - [Update precommit tasks](#update-precommit-tasks)
  - [Manage icons](#manage-icons)
  - [Manage styles](#manage-styles)
    - [Add styles](#add-styles)
    - [Generate a Material theme](#generate-a-material-theme)
    - [Override Material styles](#override-material-styles)
  - [Manage i18n](#manage-i18n)
    - [Add a language](#add-a-language)
    - [Change the default language](#change-the-default-language)
    - [Remove a language](#remove-a-language)
  - [Manage environments](#manage-environments)
    - [Add an environment](#add-an-environment)
    - [Add an environment variable](#add-an-environment-variable)
  - [Manage releases](#manage-releases)
    - [Set up Release Please](#set-up-release-please)
    - [Cut a release](#cut-a-release)
    - [Cut a major release](#cut-a-major-release)
  - [Deploy](#deploy)
    - [Vercel](#vercel)
  - [Supabase](#supabase)
    - [Set up Supabase](#set-up-supabase)
    - [Link a Supabase project](#link-a-supabase-project)
    - [Run Supabase locally](#run-supabase-locally)
    - [Remove Supabase](#remove-supabase)
- [Sponsors](#sponsors)

<br />

[↑ Back to Contents](#contents)

## Features

- **Modern Angular**: Signals, new template syntax, Zoneless, Standalone, and more.
- **Strict linting and formatting**: Strict configurations for ESLint, Prettier and TypeScript.
- **Performant**: Modular and tree-shakeable. 80+ on [PageSpeed Insights](https://pagespeed.web.dev/).
- **Secure**: Locked-down CSP and other security headers. 80+ on [Mozilla Observatory](https://developer.mozilla.org/en-US/observatory).
- **Always up-to-date**: Actively maintained and regularly built from the ground-up. [See 1000+ commits](https://github.com/karmasakshi/jet/commits/main/).

<br />

[↑ Back to Contents](#contents)

### Integrations

- [@angular/material](https://github.com/angular/components) for components and theming support.
- [@angular/pwa](https://angular.dev/ecosystem/service-workers) for PWA support.
- [@commitlint/\*](https://github.com/conventional-changelog/commitlint) for semantic versioning.
- [@jsverse/transloco](https://github.com/jsverse/transloco) for i18n.
- [@ngx-env/builder](https://github.com/chihab/dotenv-run/tree/main/packages/angular) for .env support.
- [@supabase/supabase-js](https://github.com/supabase/supabase-js) for Supabase integration.
- [ga-gtag](https://github.com/idmadj/ga-gtag) for Google Analytics integration.

<br />

[↑ Back to Contents](#contents)

### Components

- [AppComponent](./src/app/components/app/app.component.ts)
- [FooterComponent](./src/app/components/footer/footer.component.ts)
- [HomePageComponent](./src/app/components/home-page/home-page.component.ts)
- [MessagePageComponent](./src/app/components/message-page/message-page.component.ts)
- [PageComponent](./src/app/components/page/page.component.ts)
- [ProfilePageComponent](./src/app/components/profile-page/profile-page.component.ts)
- [ResetPasswordPageComponent](./src/app/components/reset-password-page/reset-password-page.component.ts)
- [SettingsPageComponent](./src/app/components/settings-page/settings-page.component.ts)
- [SignInPageComponent](./src/app/components/sign-in-page/sign-in-page.component.ts)
- [SignOutPageComponent](./src/app/components/sign-out-page/sign-out-page.component.ts)
- [SignUpPageComponent](./src/app/components/sign-up-page/sign-up-page.component.ts)
- [UpdatePasswordPageComponent](./src/app/components/update-password-page/update-password-page.component.ts)

<br />

[↑ Back to Contents](#contents)

### Constants

- [AVATAR_FILE_MAX_SIZE](./src/app/constants/avatar-file-max-size.constant.ts)
- [COLOR_SCHEME_OPTIONS](./src/app/constants/color-scheme-options.constant.ts)
- [DEFAULT_COLOR_SCHEME_OPTION](./src/app/constants/default-color-scheme-option.constant.ts)
- [DEFAULT_LANGUAGE_OPTION](./src/app/constants/default-language-option.constant.ts)
- [DEFAULT_SETTINGS](./src/app/constants/default-settings.constant.ts)
- [LANGUAGE_OPTIONS](./src/app/constants/language-options.constant.ts)
- [NAVIGATION_MENU_ITEMS](./src/app/constants/navigation-menu-items.constant.ts)

<br />

[↑ Back to Contents](#contents)

### Directives

- [AnalyticsDirective](./src/app/directives/analytics/analytics.directive.ts)

<br />

[↑ Back to Contents](#contents)

### Enums

- [LocalStorageKey](./src/app/enums/local-storage-key.enum.ts)
- [QueryParam](./src/app/enums/query-param.enum.ts)
- [SessionStorageKey](./src/app/enums/session-storage-key.enum.ts)
- [SupabaseBucket](./src/app/enums/supabase-bucket.enum.ts)
- [SupabaseFunction](./src/app/enums/supabase-function.enum.ts)
- [SupabaseRpc](./src/app/enums/supabase-rpc.enum.ts)
- [SupabaseTable](./src/app/enums/supabase-table.enum.ts)

<br />

[↑ Back to Contents](#contents)

### Guards

- [isAuthenticatedGuard](./src/app/guards/is-authenticated/is-authenticated.guard.ts)
- [isNotAuthenticatedGuard](./src/app/guards/is-not-authenticated/is-not-authenticated.guard.ts)

<br />

[↑ Back to Contents](#contents)

### Interceptors

- [progressBarInterceptor](./src/app/interceptors/progress-bar/progress-bar.interceptor.ts)

<br />

[↑ Back to Contents](#contents)

### Services

- [AlertService](./src/app/services/alert/alert.service.ts)
- [AnalyticsService](./src/app/services/analytics/analytics.service.ts)
- [LoggerService](./src/app/services/logger/logger.service.ts)
- [ProfileService](./src/app/services/profile/profile.service.ts)
- [ProgressBarService](./src/app/services/progress-bar/progress-bar.service.ts)
- [ServiceWorkerService](./src/app/services/service-worker/service-worker.service.ts)
- [SettingsService](./src/app/services/settings/settings.service.ts)
- [StorageService](./src/app/services/storage/storage.service.ts)
- [SupabaseService](./src/app/services/supabase/supabase.service.ts)
- [ToolbarTitleService](./src/app/services/toolbar-title/toolbar-title.service.ts)
- [UserService](./src/app/services/user/user.service.ts)

<br />

[↑ Back to Contents](#contents)

### GitHub Actions

- [release-please](./.github/workflows/release-please.yml)
- [deploy-supabase-functions](./.github/workflows/deploy-supabase-functions.yml)

<br />

[↑ Back to Contents](#contents)

### GitHub Issue Templates

- [Bug](./.github/ISSUE_TEMPLATE/bug.md)
- [Documentation](./.github/ISSUE_TEMPLATE/documentation.md)
- [Enhancement](./.github/ISSUE_TEMPLATE/enhancement.md)
- [Question](./.github/ISSUE_TEMPLATE/question.md)

## Guides

If you need help with something not listed here, [create a new issue](https://github.com/karmasakshi/jet/issues).

<br />

[↑ Back to Contents](#contents)

### Get started

- Click on **Use this template** > **Create a new repository** at the top of this repository
- Create the new repository, clone it, then open it
- Delete [FUNDING.yml](./.github/FUNDING.yml)
- Delete [CHANGELOG.md](./CHANGELOG.md); a fresh one will be created automatically on your first release
- Delete [LICENSE](./LICENSE) and `license` in [package.json](./package.json)
- Create a copy of `.env.example` and name it `.env`
- Update the `license` property in [package.json](./package.json)
- Update the `version` property to `0.0.0` in [package.json](./package.json) and [package-lock.json](./package-lock.json)
- Run `npm install` - this will also enable [Husky](https://typicode.github.io/husky/)

Nice to do:

- Update [README.md](./README.md)
- Set `this._prefix` in [StorageService](./src/app/services/storage/storage.service.ts) to something unique to the project

<br />

[↑ Back to Contents](#contents)

### Add elements

Use [ng g](https://angular.dev/cli/generate) as you would in any other Angular project.

<br />

[↑ Back to Contents](#contents)

#### Add a component

- Run `ng g c components/<component-name>`
- In the `@Component()` decorator:
  - Set `changeDetection: ChangeDetectionStrategy.OnPush`
  - Set `imports: [TranslocoModule]`
- In the class:
  - Set `private readonly _loggerService = inject(LoggerService);`
  - As a convention, at the end of the constructor, set `this._loggerService.logComponentInitialization('<ClassName>');`
- As a convention, add the component selector as a key in [en.json](./public/i18n/en.json) and other translation files
- Update spec

In the template, wrap the contents in:

```html
<ng-container *transloco="let t"> ... </ng-container>
```

<br />

[↑ Back to Contents](#contents)

#### Add a page component

- Run `ng g c components/<component-name>`
- In the `@Component()` decorator:
  - Set `changeDetection: ChangeDetectionStrategy.OnPush`
  - Set `imports: [TranslocoModule, PageComponent]`
- In the class:
  - Set `private readonly _loggerService = inject(LoggerService);`
  - As a convention, at the end of the constructor, set `this._loggerService.logComponentInitialization('<ClassName>');`
- As a convention, add the component selector as a key in [en.json](./public/i18n/en.json) and other translation files
- Update spec
- Add a route to it in [app.routes.ts](./src/app/app.routes.ts)
- Update [sitemap-main.xml](./public/sitemaps/sitemap-main.xml)
- If required, add an icon and navigation link to it in [NAVIGATION_MENU_ITEMS](./src/app/constants/navigation-menu-items.constant.ts)

In the template, wrap the contents in:

```html
<ng-container *transloco="let t">
  <jet-page
    [seoDescription]="t('<component-selector>.seo.description')"
    [seoKeywords]="t('<component-selector>.seo.keywords')"
    [seoTitle]="t('<component-selector>.seo.title')"
    [toolbarTitle]="t('<component-selector>.toolbar-title')"
  >
    ...
  </jet-page>
</ng-container>
```

<br />

[↑ Back to Contents](#contents)

#### Add a service

- Run `ng g s services/<service-name>/<service-name>`
- In the class:
  - Set `private readonly _loggerService = inject(LoggerService);`
  - As a convention, at the end of the constructor, set `this._loggerService.logServiceInitialization('<ClassName>');`
- Add mock
- Update spec

<br />

[↑ Back to Contents](#contents)

### Manage code

When enabled, [Husky](https://typicode.github.io/husky/) prevents pushing code that fails linting or building.

<br />

[↑ Back to Contents](#contents)

#### Format code

Run `npm run format-staged` to format staged files. This runs automatically before every commit via [Husky](https://typicode.github.io/husky/) and [Lint Staged](https://github.com/lint-staged/lint-staged).

Run `npm run format` to format all files.

<br />

[↑ Back to Contents](#contents)

#### Lint code

Run `ng lint`. This runs automatically before every commit via [Husky](https://typicode.github.io/husky/) and ESLint.

<br />

[↑ Back to Contents](#contents)

#### Test code

Run `ng test`.

<br />

[↑ Back to Contents](#contents)

#### Commit code

Run `npm run commit`, or commit directly with a valid commit message.

Commit messages that don't follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) will be blocked by [Husky](https://typicode.github.io/husky/) and [Commitlint](https://commitlint.js.org/).

<br />

[↑ Back to Contents](#contents)

#### Update commit scopes

In [.commitlintrc.json](./.commitlintrc.json), update `"scope-enum": [2, "always", ["general", "main", "<your-scope-1>", ..., "<your-scope-n>"]]`.

<br />

[↑ Back to Contents](#contents)

#### Update precommit tasks

Update [pre-commit](./.husky/pre-commit). As a good practice, ensure every task is defined [package.json](./package.json) and can be run independently.

More tasks mean longer commit times.

<br />

[↑ Back to Contents](#contents)

#### Update dependencies

Run `npm run reinstall-dependencies`. It runs the following subscripts to remove all dependencies, then install their latest versions: `x:uninstall-devDependencies`, `x:uninstall-dependencies`, `x:install-dependencies`, `x:install-devDependencies`. You shouldn't have to run these subscripts yourself.

For this to work, ensure the subscripts are updated every time a dependency is added or removed.

<br />

[↑ Back to Contents](#contents)

### Manage icons

Jet uses [Material Symbols](https://fonts.google.com/icons?icon.style=Rounded) for icons. Instead of downloading the entire font, each icon is explicitly specified in [index.html](./src/index.html) and the resulting custom font is preloaded for performance. To add or remove icons:

- Update the icon names **alphabetically** in the `<link>` element (read more about this requirement [here](https://developers.google.com/fonts/docs/material_symbols#optimize_the_icon_font))
- Build the project
- Copy the custom font URL from `./dist/jet/browser/index.html` to [index.html](./src/index.html) for preloading

Custom SVG icons can be loaded in `_setIcons()` in [AppComponent](./src/app/components/app/app.component.ts).

WARNING: Browser will download two icon files if preload URL is different from the resolved URL.

<br />

[↑ Back to Contents](#contents)

### Manage styles

<br />

[↑ Back to Contents](#contents)

#### Add styles

<br />

[↑ Back to Contents](#contents)

#### Generate a Material theme

<br />

[↑ Back to Contents](#contents)

#### Override Material styles

<br />

[↑ Back to Contents](#contents)

### Manage i18n

<br />

[↑ Back to Contents](#contents)

#### Add a language

<br />

[↑ Back to Contents](#contents)

#### Change the default language

<br />

[↑ Back to Contents](#contents)

#### Remove a language

<br />

[↑ Back to Contents](#contents)

### Manage environments

<br />

[↑ Back to Contents](#contents)

#### Add an environment

<br />

[↑ Back to Contents](#contents)

#### Add an environment variable

<br />

[↑ Back to Contents](#contents)

### Manage releases

<br />

[↑ Back to Contents](#contents)

#### Set up Release Please

<br />

[↑ Back to Contents](#contents)

#### Cut a release

<br />

[↑ Back to Contents](#contents)

#### Cut a major release

<br />

[↑ Back to Contents](#contents)

### Deploy

<br />

[↑ Back to Contents](#contents)

#### Vercel

<br />

[↑ Back to Contents](#contents)

### Supabase

<br />

[↑ Back to Contents](#contents)

#### Set up Supabase

- Set `project_id` in [config.toml](./supabase/config.toml) to something unique to the project

<br />

[↑ Back to Contents](#contents)

#### Link a Supabase project

<br />

[↑ Back to Contents](#contents)

#### Run Supabase locally

<br />

[↑ Back to Contents](#contents)

#### Remove Supabase

<br />

[↑ Back to Contents](#contents)
