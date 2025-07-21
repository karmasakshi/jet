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

## Contents

- [Features](#features)
  - [Integrations](#integrations)
  - [Components](#components)
  - [Directives](#directives)
  - [Guards](#guards)
  - [Services](#services)
  - [GitHub Actions](#github-actions)
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
- **Always up-to-date**: Actively maintained and regularly built from the ground-up.

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

### Directives

- [AnalyticsDirective](./src/app/directives/analytics/analytics.directive.ts)

<br />

[↑ Back to Contents](#contents)

### Guards

- [isAuthenticatedGuard](./src/app/guards/is-authenticated/is-authenticated.guard.ts)
- [isNotAuthenticatedGuard](./src/app/guards/is-not-authenticated/is-not-authenticated.guard.ts)

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

## Guides

<br />

[↑ Back to Contents](#contents)

### Get started

- Click on the **Use this template** button on the top
- Create the repository and clone it
- Delete [FUNDING.yml](./.github/FUNDING.yml)
- Delete [CHANGELOG.md](./CHANGELOG.md); it will be created automatically on your first release
- Create a copy of `.env.example` and name it `.env`
- Update the `version` property to `0.0.0` in [package.json](./package.json) and [package-lock.json](./package-lock.json)
- Run `npm install`

<br />

[↑ Back to Contents](#contents)

### Add elements

Use [ng generate](https://angular.dev/cli/generate) as you would in any other Angular project.

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
- Update spec
- Add a key in [en.json](./public/i18n/en.json) and other translations

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
- Update spec
- Add a key in [en.json](./public/i18n/en.json) and other translations
- Add a route to it in [app.routes.ts](./src/app/app.routes.ts)
- If required, add an icon and link to it in [navigation-menu-items.constant.ts](./src/app/constants/navigation-menu-items.constant.ts)

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
- Update spec
- Add mock

<br />

[↑ Back to Contents](#contents)

### Manage code

Commit messages that don't follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) will be blocked by [Husky](https://typicode.github.io/husky/) and [Commitlint](https://commitlint.js.org/).

<br />

[↑ Back to Contents](#contents)

#### Format code

Run `npm run format-staged` to format staged files. This is run automatically before every commit by [Husky](https://typicode.github.io/husky/) and [Lint Staged](https://github.com/lint-staged/lint-staged).

Run `npm run format` to format all files.

<br />

[↑ Back to Contents](#contents)

#### Lint code

Run `ng lint`.

<br />

[↑ Back to Contents](#contents)

#### Test code

Run `ng test`.

<br />

[↑ Back to Contents](#contents)

#### Commit code

Run `npm run commit`, or commit directly with a valid commit message.

<br />

[↑ Back to Contents](#contents)

#### Update commit scopes

In [.commitlintrc.json](./.commitlintrc.json), update `"scope-enum": [2, "always", ["general", "main", "<your-scope-1>", ..., "<your-scope-n>"]]`.

<br />

[↑ Back to Contents](#contents)

#### Update precommit tasks

Update [pre-commit](./.husky/pre-commit). As a good practice, ensure every task is defined [package.json](./package.json) and can be run independently.

<br />

[↑ Back to Contents](#contents)

#### Update dependencies

Run `npm run reinstall-dependencies`. It calls the following subscripts to remove all dependencies, then install their latest versions: `x:uninstall-devDependencies`, `x:uninstall-dependencies`, `x:install-dependencies`, `x:install-devDependencies`.

For this to work, ensure the subscripts are updated every time a dependency is added or removed.

<br />

[↑ Back to Contents](#contents)

### Manage icons

Jet uses [Material Symbols](https://fonts.google.com/icons?icon.style=Rounded) for icons. Instead of downloading the entire font, each icon is explicitly specified in [index.html](./src/index.html) and the custom font is preloaded for performance. To add or remove icons:

- Update the icon names alphabetically in the `<link>` element, as specified [here](https://developers.google.com/fonts/docs/material_symbols#optimize_the_icon_font)
- Build the project
- Copy the custom font URL from `./dist/jet/browser/index.html` to [index.html](./src/index.html) for preloading

Custom SVG icons can be loaded in `_setIcons()` in [AppComponent](./src/app/components/app/app.component.ts).

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

#### Link a Supabase project

<br />

[↑ Back to Contents](#contents)

#### Run Supabase locally

<br />

[↑ Back to Contents](#contents)

#### Remove Supabase

<br />

[↑ Back to Contents](#contents)

## Sponsors

Pay what you like; support development of Jet: https://karmasakshi.lemonsqueezy.com/buy/b4db1f83-66be-426d-b286-985b1e6b13ce.

<p align="center">
  <a
    href="https://github.com/byjokese"
    target="_blank"
  ><img
    alt="byjokese"
    src="https://github.com/byjokese.png"
    width="64"
  /></a>
  &nbsp;
  <a
    href="https://github.com/dipenpradhan"
    target="_blank"
  ><img
    alt="dipenpradhan"
    src="https://github.com/dipenpradhan.png"
    width="64"
  /></a>
  &nbsp;
  <a
    href="https://github.com/lohiaad"
    target="_blank"
  ><img
    alt="lohiaad"
    src="https://github.com/lohiaad.png"
    width="64"
  /></a>
  &nbsp;
  <a
    href="https://github.com/singhamit089"
    target="_blank"
  ><img
    alt="singhamit089"
    src="https://github.com/singhamit089.png"
    width="64"
  /></a>
</p>

<br />

[↑ Back to Contents](#contents)
