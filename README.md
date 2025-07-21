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
  - [Getting started](#getting-started)
  - [Adding elements](#adding-elements)
    - [Add a component](#add-a-component)
    - [Add a page component](#add-a-page-component)
    - [Add a service](#add-a-service)
  - [Committing changes](#committing-changes)
    - [Add a commit scope](#add-a-commit-scope)
    - [Format code](#format-code)
    - [Lint code](#lint-code)
    - [Test code](#test-code)
    - [Commit code](#commit-code)
    - [Update precommit script](#update-precommit-script)
  - [Icons](#icons)
    - [Add an icon](#add-an-icon)
    - [Remove an icon](#remove-an-icon)
  - [Style](#style)
    - [Add styles](#add-styles)
    - [Generate a Material theme](#generate-a-material-theme)
    - [Override Material styles](#override-material-styles)
  - [Internationalization](#internationalization)
    - [Add a language](#add-a-language)
    - [Change the default language](#change-the-default-language)
    - [Remove a language](#remove-a-language)
  - [Environments](#environments)
    - [Add an environment](#add-an-environment)
    - [Add an environment variable](#add-an-environment-variable)
  - [Release](#release)
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

### Getting started

- Click on the **Use this template** button on the top
- Create the repository and clone it
- Delete [FUNDING.yml](./.github/FUNDING.yml)
- Delete [CHANGELOG.md](./CHANGELOG.md); one will be created automatically on your first release
- Create a copy of `.env.example` and name it `.env`
- Set the `version` property to `0.0.0` in [package.json](./package.json) and [package-lock.json](./package-lock.json)
- Run `npm install`

<br />

[↑ Back to Contents](#contents)

### Adding elements

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
- Add a parent key in translations

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
- Add a parent key in translations

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

### Committing changes

Commit messages that don't follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) will be blocked by [Husky](https://typicode.github.io/husky/) and [Commitlint](https://commitlint.js.org/).

<br />

[↑ Back to Contents](#contents)

#### Add a commit scope

In [.commitlintrc.json](./.commitlintrc.json), set `"scope-enum": [2, "always", ["general", "main", "<your-scope>"]]`.

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

Run `npm run commit` or commit directly with a valid commit message.

<br />

[↑ Back to Contents](#contents)

#### Update precommit script

Update [pre-commit](./.husky/pre-commit). As a good practice, first define the script in [package.json](./package.json) and then invoke it here.

<br />

[↑ Back to Contents](#contents)

### Icons

<br />

[↑ Back to Contents](#contents)

#### Add an icon

<br />

[↑ Back to Contents](#contents)

#### Remove an icon

<br />

[↑ Back to Contents](#contents)

### Style

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

### Internationalization

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

### Environments

<br />

[↑ Back to Contents](#contents)

#### Add an environment

<br />

[↑ Back to Contents](#contents)

#### Add an environment variable

<br />

[↑ Back to Contents](#contents)

### Release

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
    href="https://github.com/singhamit089"
    target="_blank"
  ><img
    alt="singhamit089"
    src="https://github.com/singhamit089.png"
    width="64"
  /></a>
  &nbsp;
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
</p>

<br />

[↑ Back to Contents](#contents)
